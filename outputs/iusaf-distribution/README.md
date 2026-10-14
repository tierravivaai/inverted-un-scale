# UN scale → raw inversion → banded inversion

Presentation figures, each supplied as a high-resolution PNG and an SVG. Insert PNG into PowerPoint for predictable appearance; SVG remains sharp when resized and can be converted to editable shapes in compatible PowerPoint versions.

`country-distributions` shows one bar per Party, in the same ascending-assessment order in all three panels. Vertical scales differ and are explicitly labelled. The first panel retains actual UN percentages, without rescaling. The next two show normalized allocation percentages, not dollars. Multiply allocation percent by USD 10 million for a USD 1 billion fund.

`band-share-comparison` uses 100% stacked bars grouped by the paper's bands. The original UN assessment subtotal is normalized within the 142-Party cohort for this figure only. This chart shows total band shares, not allocations per Party; larger band membership affects segment size. It cannot be used to assess per-Party monotonicity.

Data: local cali-allocation-model-unscale-v3/data-raw/UNGA_scale_of_assessment.csv, column 2027; country_allocations_full.csv provides the 142-Party membership and band weights. The existing fig_2_non_high_income.csv provides canonical-name matching; all positive assessment values were checked against the raw source using repository name mappings.

Cook Islands, Niue and State of Palestine have no positive UN assessment. Raw 1/0 is undefined; following the original model, they receive zero and are excluded from normalization of reciprocal weights. This is a model convention, not the mathematical inverse of zero. Banded inversion assigns them Band 1 weight 1.50. They remain visible in the fixed 142-Party cohort.

Baseline weights: [1.50,1.30,1.10,0.95,0.75,0.40]; counts: [31,59,30,18,3,1]. No stewardship allocation. Data are a repository snapshot, not an updated eligibility assessment.

figure-data.csv contains the unrounded plotted values. All normalized series sum to 100% within numerical precision.

`full-un-assessment-distribution` shows all 193 positive-assessment Member States before eligibility filtering.

`country-distributions-segmented` is a separate version of the country distribution figure. Its UN-assessment panel is split into six band segments with independently labelled vertical scales, retaining the actual recorded percentages. Segment widths are equal and do not represent Party counts. The raw and banded inversion panels retain the full 142-Party ordering. The original `country-distributions` files are unchanged.

`country-distributions-four-panels` adds the original full-scale UN assessment view above the segmented view, followed by raw and banded inversion. China remains visible as the outlier in the first panel. The second panel uses independent vertical scales and equal segment widths, not membership-proportional widths. Original versions are preserved.
