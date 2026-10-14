# IUSAF banding: repository history audit

Reviewed 9 October 2026. No model or application changes made during this audit.

## Recorded sequence

- 26 January 2026 — UNSCALE history, commit 62be60f: initial raw-inversion model; bbe0a92 makes fractions and normalization explicit.
- 14 March 2026 — UNSCALE-v2, commit 2c56a65370b4a4cbb1549ab283d73d64e158bcf9: introduces band inversion as an alternative. New config contains five fixed weights: 1.50, 1.30, 1.10, 0.95, 0.75. Thresholds are 0.001%, 0.01%, 0.1%, 1%, then an open upper band. Code assigns the configured weight to each Party and normalizes across Parties; it does not estimate the weights from the assessment data. The accompanying test explicitly assigns China to the top band with weight 0.75.
- The same March 14 implementation explains in the UI: “Band-based inversion groups countries into broad UN assessment bands and applies a transparent graduated uplift, instead of mechanically inverting every small difference in the UN scale.”
- 15 March 2026 — UNSCALE-v2, commit 1bb006e: band inversion becomes the default.
- 26 March 2026 — unscale-v3, commit 4ec8b55dba871778828cf090d3b0e626f0fc20f8: recorded change caps Band 5 at 10% and adds Band 6 above 10%, weight 0.40. The original five weights are unchanged. Configuration comments explain separating China (~20%) from Brazil/India/Mexico (~1.1–1.4%); 0.40 gives China approximately 53% of each Band 5 Party's allocation while preserving a non-zero floor. They describe 0.30–0.55 as a possible range, not a mathematically exhaustive range.
- 15 April 2026 — v3, commit 0752654: later documentation records the logarithmic threshold rationale. It is subsequent explanation, not the original March proposal.

## What the increments establish

The March 26 instructions/v3_implementation_workplan.md explicitly requests 0.005 increments for the TSAC and SOSAC parameter sweeps. As fractional fund shares, these are 0.5 percentage-point steps. This is not evidence that 0.40 was selected to make IUSAF weight arithmetic easier. Such a motivation remains possible but was not established by the records examined.

## Conclusions and limits

The transition from raw inversion to five bands, then six, is confirmed by commits and code. The 2:1 endpoint ratio follows from the five-band weights; 3.75:1 follows after adding 0.40 for China. No fitting/optimization routine or contemporaneous derivation of the five exact starting weights was found in the inspected introduction commit. The records establish how weights were implemented, not every reason discussed before implementation. Commit dates establish when changes were recorded, not necessarily the date each design decision was first made.

Repositories inspected: /Users/pauloldham/Documents/cali-allocation-model; /Users/pauloldham/Documents/cali-allocation-model-UNSCALE; /Users/pauloldham/Documents/cali-allocation-model-UNSCALE-v2; /Users/pauloldham/Documents/cali-allocation-model-unscale-v3.
