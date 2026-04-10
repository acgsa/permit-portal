"""Synopsis evaluation engine — determines required reviews, agencies, and NEPA level."""

from __future__ import annotations

from typing import Optional

from sqlalchemy.orm import Session

from ..models.routing_rules import AgencyRoutingRule
from ..schemas.synopsis import (
    AgencyAssignment,
    FormRequirement,
    ReviewRequirement,
    SynopsisRequest,
    SynopsisResult,
)

# ── Seed data (inserted on first startup if table is empty) ────────────────

SEED_RULES: list[dict] = [
    # ── Category → Lead Agency ─────────────────────────────────────────────
    {
        "trigger_type": "category",
        "trigger_value": "energy-utility",
        "agency_code": "DOI-BLM",
        "agency_name": "Bureau of Land Management",
        "agency_role": "lead",
        "review_name": None,
        "form_id": "SF-299",
        "form_title": "Application for Transportation and Utility Systems and Facilities on Federal Lands",
        "priority": 10,
    },
    {
        "trigger_type": "category",
        "trigger_value": "transportation-road",
        "agency_code": "DOT-FHWA",
        "agency_name": "Federal Highway Administration",
        "agency_role": "lead",
        "review_name": None,
        "form_id": "SF-299",
        "form_title": "Application for Transportation and Utility Systems and Facilities on Federal Lands",
        "priority": 10,
    },
    {
        "trigger_type": "category",
        "trigger_value": "communications-telecommunications",
        "agency_code": "FCC",
        "agency_name": "Federal Communications Commission",
        "agency_role": "lead",
        "review_name": None,
        "form_id": "FCC-Form-601",
        "form_title": "FCC Wireless Telecommunications Bureau Application",
        "priority": 10,
    },
    {
        "trigger_type": "category",
        "trigger_value": "water-canal-irrigation",
        "agency_code": "USACE",
        "agency_name": "U.S. Army Corps of Engineers",
        "agency_role": "lead",
        "review_name": None,
        "form_id": "ENG-4345",
        "form_title": "Application for Department of the Army Permit",
        "priority": 10,
    },
    {
        "trigger_type": "category",
        "trigger_value": "other",
        "agency_code": "DOI-BLM",
        "agency_name": "Bureau of Land Management",
        "agency_role": "lead",
        "review_name": None,
        "form_id": "SF-299",
        "form_title": "Application for Transportation and Utility Systems and Facilities on Federal Lands",
        "priority": 5,
    },
    # ── Impact → Additional Reviews ────────────────────────────────────────
    {
        "trigger_type": "impact",
        "trigger_value": "impactsWaterBodies",
        "agency_code": "USACE",
        "agency_name": "U.S. Army Corps of Engineers",
        "agency_role": "cooperating",
        "review_name": "Clean Water Act Section 404 Permit",
        "review_authority": "33 U.S.C. § 1344",
        "review_description": "Permit required for discharge of dredged or fill material into waters of the United States, including wetlands.",
        "estimated_days": 120,
        "priority": 20,
    },
    {
        "trigger_type": "impact",
        "trigger_value": "impactsSpeciesHabitat",
        "agency_code": "USFWS",
        "agency_name": "U.S. Fish and Wildlife Service",
        "agency_role": "consulting",
        "review_name": "Endangered Species Act Section 7 Consultation",
        "review_authority": "16 U.S.C. § 1536",
        "review_description": "Formal consultation required when a project may affect listed or proposed endangered/threatened species or designated critical habitat.",
        "estimated_days": 135,
        "priority": 20,
    },
    {
        "trigger_type": "impact",
        "trigger_value": "impactsHistoricCultural",
        "agency_code": "ACHP",
        "agency_name": "Advisory Council on Historic Preservation",
        "agency_role": "consulting",
        "review_name": "National Historic Preservation Act Section 106 Review",
        "review_authority": "54 U.S.C. § 306108",
        "review_description": "Review to assess effects on historic properties and consult with State Historic Preservation Officers.",
        "estimated_days": 90,
        "priority": 20,
    },
    {
        "trigger_type": "impact",
        "trigger_value": "impactsAirEnvironmental",
        "agency_code": "EPA",
        "agency_name": "Environmental Protection Agency",
        "agency_role": "cooperating",
        "review_name": "Clean Air Act Conformity Determination",
        "review_authority": "42 U.S.C. § 7506(c)",
        "review_description": "Determination required that the project conforms to the applicable State Implementation Plan for air quality.",
        "estimated_days": 60,
        "priority": 20,
    },
    {
        "trigger_type": "impact",
        "trigger_value": "impactsWaterways",
        "agency_code": "USACE",
        "agency_name": "U.S. Army Corps of Engineers",
        "agency_role": "cooperating",
        "review_name": "Rivers and Harbors Act Section 10 Permit",
        "review_authority": "33 U.S.C. § 403",
        "review_description": "Permit required for any work in, over, or under navigable waters of the United States.",
        "estimated_days": 90,
        "priority": 20,
    },
]

# ── Impact field keys (matches frontend IMPACT_QUESTIONS) ─────────────────

_IMPACT_KEYS = [
    "impactsWaterBodies",
    "impactsSpeciesHabitat",
    "impactsHistoricCultural",
    "impactsAirEnvironmental",
    "impactsWaterways",
]


def seed_routing_rules(db: Session) -> None:
    """Insert default routing rules if the table is empty."""
    count = db.query(AgencyRoutingRule).count()
    if count > 0:
        return

    for rule_data in SEED_RULES:
        db.add(AgencyRoutingRule(**rule_data))
    db.commit()


def generate_synopsis(intake: SynopsisRequest, db: Session) -> SynopsisResult:
    """Evaluate intake data against routing rules and return a structured synopsis."""

    rules = db.query(AgencyRoutingRule).order_by(AgencyRoutingRule.priority.desc()).all()

    # Build lookup tables from DB rules
    category_rules: dict[str, list[AgencyRoutingRule]] = {}
    impact_rules: dict[str, list[AgencyRoutingRule]] = {}
    for rule in rules:
        if rule.trigger_type == "category":
            category_rules.setdefault(rule.trigger_value, []).append(rule)
        elif rule.trigger_type == "impact":
            impact_rules.setdefault(rule.trigger_value, []).append(rule)

    # ── Determine lead agency from project categories ──────────────────────
    lead_agency: Optional[AgencyAssignment] = None
    required_forms: list[FormRequirement] = []
    seen_forms: set[str] = set()

    for cat in intake.projectCategories:
        cat_rules = category_rules.get(cat, [])
        for rule in cat_rules:
            if lead_agency is None:
                lead_agency = AgencyAssignment(
                    code=rule.agency_code,
                    name=rule.agency_name,
                    role="lead",
                )
            if rule.form_id and rule.form_id not in seen_forms:
                required_forms.append(
                    FormRequirement(
                        form_id=rule.form_id,
                        title=rule.form_title or rule.form_id,
                        agency_code=rule.agency_code,
                    )
                )
                seen_forms.add(rule.form_id)

    # Fallback if no category matched
    if lead_agency is None:
        lead_agency = AgencyAssignment(
            code="DOI-BLM",
            name="Bureau of Land Management",
            role="lead",
        )

    # ── Determine required reviews from impacts ────────────────────────────
    required_reviews: list[ReviewRequirement] = []
    cooperating_agencies: list[AgencyAssignment] = []
    seen_agencies: set[str] = set()
    impact_count = 0

    impact_fields = {
        "impactsWaterBodies": intake.impactsWaterBodies,
        "impactsSpeciesHabitat": intake.impactsSpeciesHabitat,
        "impactsHistoricCultural": intake.impactsHistoricCultural,
        "impactsAirEnvironmental": intake.impactsAirEnvironmental,
        "impactsWaterways": intake.impactsWaterways,
    }

    for impact_key, impact_field in impact_fields.items():
        if impact_field.answer != "yes":
            continue
        impact_count += 1

        for rule in impact_rules.get(impact_key, []):
            required_reviews.append(
                ReviewRequirement(
                    name=rule.review_name or "Review Required",
                    authority=rule.review_authority or "",
                    agency_code=rule.agency_code,
                    agency_name=rule.agency_name,
                    description=rule.review_description or "",
                    estimated_days=rule.estimated_days,
                    trigger=impact_key,
                )
            )
            if rule.agency_code not in seen_agencies and rule.agency_code != lead_agency.code:
                cooperating_agencies.append(
                    AgencyAssignment(
                        code=rule.agency_code,
                        name=rule.agency_name,
                        role=rule.agency_role or "cooperating",
                    )
                )
                seen_agencies.add(rule.agency_code)

    # ── Determine NEPA level ───────────────────────────────────────────────
    if impact_count >= 3:
        nepa_level = "Environmental Impact Statement"
        nepa_explanation = (
            "Your project triggers multiple significant environmental impact areas. "
            "An Environmental Impact Statement (EIS) is likely required under NEPA "
            "to provide a detailed analysis of environmental effects and alternatives."
        )
    elif impact_count >= 1:
        nepa_level = "Environmental Assessment"
        nepa_explanation = (
            "Your project may affect one or more environmental resources. "
            "An Environmental Assessment (EA) will be prepared to determine "
            "whether the impacts are significant enough to require a full EIS."
        )
    else:
        nepa_level = "Categorical Exclusion"
        nepa_explanation = (
            "Based on your responses, your project does not appear to trigger "
            "significant environmental impacts. It may qualify for a Categorical "
            "Exclusion (CatEx), which streamlines the review process."
        )

    # ── Estimate timeline ──────────────────────────────────────────────────
    base_days = {"Categorical Exclusion": 30, "Environmental Assessment": 180, "Environmental Impact Statement": 365}
    review_days = sum(r.estimated_days or 0 for r in required_reviews)
    # Reviews run in parallel with NEPA, so take the max rather than sum
    estimated_timeline = max(base_days.get(nepa_level, 180), review_days)

    # ── Build summary narrative ────────────────────────────────────────────
    category_labels = ", ".join(intake.projectCategories) if intake.projectCategories else "unspecified"
    review_summary = (
        f" Additionally, {len(required_reviews)} supplemental review(s) will be required."
        if required_reviews
        else ""
    )
    summary = (
        f"Based on your project description ({category_labels}), "
        f"the lead federal agency is {lead_agency.name}. "
        f"The anticipated NEPA review level is {nepa_level}."
        f"{review_summary} "
        f"Estimated processing time is approximately {estimated_timeline} days."
    )

    return SynopsisResult(
        nepa_level=nepa_level,
        nepa_explanation=nepa_explanation,
        required_reviews=required_reviews,
        required_forms=required_forms,
        lead_agency=lead_agency,
        cooperating_agencies=cooperating_agencies,
        estimated_timeline_days=estimated_timeline,
        summary=summary,
    )
