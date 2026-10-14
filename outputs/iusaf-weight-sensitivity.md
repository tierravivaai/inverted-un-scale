# IUSAF baseline weight sensitivity

9 October 2026

## Finding

The paper's weights are a transparent, strictly monotonic baseline. They are not uniquely implied by the UN assessment bands or by monotonicity. Both the endpoint ratio and the intermediate progression materially affect allocations. This analysis tests sensitivity; it does not select an optimal policy or reconstruct the original design rationale.

## Method

Hold the fund at USD 1 billion, membership at 142 Parties, and band counts at [31, 59, 30, 18, 3, 1]. For each scenario, allocate to each Party in band i as F × w_i / Σ(n_j × w_j). Country membership is unchanged. No SOSAC or TSAC components are included.

Compare two alternative progressions at the paper's 3.75:1 endpoint ratio, then two alternative ratios using the application's baseline-shape transformation. Alternatives are analytical benchmarks introduced for this comparison, not claims about the paper's derivation.

- Equal absolute steps: w_i = 1.50 − (i−1) × 0.22.
- Equal proportional steps: w_i = 1.50 × (0.40/1.50)^((i−1)/5). Successive weights retain approximately 76.77% of the previous weight.
- Baseline-shape ratio r: w_i = 0.40 × (baseline_i/0.40)^(ln(r)/ln(3.75)). This is the application's exploratory interpolation.

The raw scale of weights has no effect after normalization: multiplying all six weights by the same positive constant leaves allocations unchanged.

## Weights

| Scenario | B1 | B2 | B3 | B4 | B5 | B6 |
|---|---:|---:|---:|---:|---:|---:|
| Paper baseline | 1.5000 | 1.3000 | 1.1000 | 0.9500 | 0.7500 | 0.4000 |
| Equal absolute steps · 3.75:1 | 1.5000 | 1.2800 | 1.0600 | 0.8400 | 0.6200 | 0.4000 |
| Equal proportional steps · 3.75:1 | 1.5000 | 1.1516 | 0.8841 | 0.6787 | 0.5210 | 0.4000 |
| Baseline shape · 2:1 | 0.8000 | 0.7422 | 0.6799 | 0.6296 | 0.5562 | 0.4000 |
| Baseline shape · 5:1 | 2.0000 | 1.6802 | 1.3709 | 1.1468 | 0.8600 | 0.4000 |

## Allocation per Party (USD millions)

| Scenario | B1 | B2 | B3 | B4 | B5 | B6 |
|---|---:|---:|---:|---:|---:|---:|
| Paper baseline | 8.525 | 7.388 | 6.252 | 5.399 | 4.263 | 2.273 |
| Equal absolute steps · 3.75:1 | 8.762 | 7.477 | 6.192 | 4.907 | 3.621 | 2.336 |
| Equal proportional steps · 3.75:1 | 9.669 | 7.423 | 5.698 | 4.375 | 3.358 | 2.578 |
| Baseline shape · 2:1 | 7.814 | 7.249 | 6.641 | 6.149 | 5.432 | 3.907 |
| Baseline shape · 5:1 | 8.854 | 7.438 | 6.069 | 5.077 | 3.807 | 1.771 |

## Change from paper baseline (%)

| Scenario | B1 | B2 | B3 | B4 | B5 | B6 |
|---|---:|---:|---:|---:|---:|---:|
| Equal absolute steps · 3.75:1 | +2.8% | +1.2% | -1.0% | -9.1% | -15.0% | +2.8% |
| Equal proportional steps · 3.75:1 | +13.4% | +0.5% | -8.9% | -19.0% | -21.2% | +13.4% |
| Baseline shape · 2:1 | -8.3% | -1.9% | +6.2% | +13.9% | +27.4% | +71.8% |
| Baseline shape · 5:1 | +3.9% | +0.7% | -2.9% | -6.0% | -10.7% | -22.1% |

## Amount redistributed relative to baseline

Half the sum of absolute changes in country allocations counts each transferred dollar once. This is a measure of scenario difference, not a cost or an efficiency score.

| Scenario | USD millions redistributed | Share of fund |
|---|---:|---:|
| Equal absolute steps · 3.75:1 | 12.60 | 1.26% |
| Equal proportional steps · 3.75:1 | 37.76 | 3.78% |
| Baseline shape · 2:1 | 30.31 | 3.03% |
| Baseline shape · 5:1 | 13.14 | 1.31% |

## Interpretation

1. **Ordering is robust by construction.** Every tested scenario is strictly decreasing across all five adjacent pairs and allocates the full fund. This does not distinguish which scenario is preferable.
2. **The original staircase favours intermediate Bands 3–5 relative to equal proportional steps with the same endpoints.** In particular, Band 4 receives about USD 1.025 million more per Party and Band 5 about USD 0.904 million more under the paper baseline. Equal absolute steps give a smaller but still material difference, particularly for Bands 4 and 5.
3. **A common ratio does not fix dollar amounts.** At 3.75:1, Band 1 ranges from USD 8.525m in the paper to USD 9.669m under equal proportional steps; China ranges from USD 2.273m to USD 2.578m. The denominator changes with the intermediate weights.
4. **A flatter 2:1 ratio under the application's transformation raises China's allocation by 71.8%, Band 5's by 27.4%, and lowers Band 1's by 8.3%.** The endpoint ratio alone does not imply these exact changes: they also depend on the transformation used.
5. **The aggregate differences are smaller than some country-level percentages.** The equal proportional benchmark redistributes 3.78% of the fund, while cutting each Band 5 Party's allocation by 21.2%. Both perspectives matter in policy discussion.
6. **None of these findings establishes a mathematical optimum.** Equal absolute and proportional steps are transparent conventions, not uniquely correct answers. The paper's baseline can be defended as a chosen graduated allocation, but a substantive rationale is still needed for the amount and pattern of differentiation.

## Implications for the paper

Separate the UN-assessment thresholds that define membership from the weights that determine the allocation gradient. Explain that strict monotonicity restricts their ordering but does not uniquely determine their values. Describe 3.75:1 as the selected six-band baseline, arising from the retained five-band weights and China's additional 0.40 weight. Report sensitivity to at least one alternative progression at the same ratio and one flatter ratio.

Suggested wording:

> The band thresholds group Parties by orders of magnitude in their UN assessed contributions. The allocation weights are specified separately to provide a graduated, strictly decreasing allocation across these bands. The baseline weights yield a Band 1-to-Band 6 per-Party ratio of 3.75:1. This ratio is a policy specification rather than a mathematical consequence of monotonicity. Alternative monotonic progressions are therefore examined as sensitivity scenarios.

## Limit of this assessment

The pure-IUSAF ordering survives all scenarios, but country dollar amounts are materially sensitive. Conclusions about SOSAC/TSAC balance points, band-order overturn, or optimal stewardship shares have NOT been tested here. Those require rerunning the combined model under each alternative; the paper's existing stewardship breakpoints cannot be assumed to remain unchanged.

## Sources and verification

Baseline weights and counts: Table 1 in the local version 3 paper, iusaf_paper-07052026.docx, previously verified against config/un_scale_bands.yaml and country_allocations_full.csv. Derivation history is recorded separately in modelling-history.md. This analysis uses the requested fixed scenario, not updated eligibility or UN assessments.

All calculations use unrounded weights. Checks confirmed strict ordering and fund conservation within floating-point tolerance for all five scenarios. Tables round only for display.
