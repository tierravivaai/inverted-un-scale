# IUSAF stewardship edition

Open IUSAF-stewardship.html in your browser. This self-contained application works offline. The original equity-only app is unchanged.

Select a fund ($50m, $200m, $500m or $1bn) and scenario. Default: strict preset, SOSAC 3%, TSAC 1.5%. Other choices: pure IUSAF; SOSAC only (3%); constrained Gini minimum (TSAC 2.5%); band boundary (TSAC 3%).

The original staircase and detail table remain a clearly labelled 100% pure-equity reference. Combined band averages, country ranges and country-level component amounts appear in a separate section. Search by country or ISO3 code. All amounts scale with the fund. Changing equity weights also updates combined allocations. The weight reset preserves the fund and scenario; the stewardship reset restores baseline weights and strict scenario while preserving fund size.

## Interpretation

The components divide the same fund. Equity receives 1 − SOSAC − TSAC of the fund and follows the six weights. SOSAC is divided equally between 39 SIDS. TSAC follows eligible land-area shares. The Gini preset is band-order constrained, not the unconstrained optimum. These are recorded suggested scenarios, not optimizations recomputed for custom weights. At the original baseline the 3% boundary is slightly past the Band 5/6 mean crossover.

The main band-order check follows the paper: descending mean allocation per Party across bands. Country-range overlaps are shown separately as information, not as band-order violations. Within-band amounts differ with stewardship. Preset names do not guarantee those checks pass.

## Sources and modular calculation

Membership comes from the existing 142-Party application. SIDS and component shares come from cali-allocation-model-unscale-v3/country_allocations.csv. TSAC land shares are recovered from the unrounded strict scenario using (strict share − 0.955 × equity share − SIDS indicator × 0.03/39) / 0.015. This reproduces the source model's land-area component without introducing a newer land dataset. Tiny floating point negatives are clamped to zero. All shares sum to one within numerical precision. The source boundary column is not used because it represents a different TSAC percentage; the 3% scenario matches the dedicated annex previously checked for the distribution figures.

model.js retains the original pure equity calculation. stewardship-model.js composes the three components independently of the interface. stewardship-data.js contains the source snapshot. To use the multi-file version, keep all files together and open index.html.

## Verification

80 combinations of fund, scenario and weights passed fund-conservation and nonnegative-allocation checks. All 142 baseline strict and Gini shares match source data; the 3% boundary matches their linear interpolation. All original app files were verified unchanged by SHA-256. Browser visual verification was blocked: Ego could not connect in this environment and the built-in browser disallowed file URLs.
