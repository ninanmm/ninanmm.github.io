---
title: "Lessons Learned from Benchmarking Automated YARA Rule Generation for In-the-Wild Malware Families"
collection: talks
type: "Workshop talk"
permalink: /talks/2026-12-07-laser-autopyara-lessons
venue: "LASER – Learning from Authoritative Security Experiment Results (co-located with ACSAC 2026)"
date: 2026-12-07
location: "Los Angeles, California, USA"
---

Upcoming talk at [LASER](https://www.acsac.org/2026/workshops/laser/), co-located with ACSAC 2026 (December 7–11, 2026). Joint work with Marcus Botacin.

Automating YARA rule generation is crucial for scaling malware incident response, yet evaluating these systems on real-world datasets is challenging, and common evaluation strategies reveal serious methodological pitfalls. This talk shares experimental insights and lessons learned from developing and benchmarking [AutoPYara](/publication/2026-10-03-autopyara-next-gen-yara-rule-generator-for-malware-family-clustering/), an open-source framework designed to overcome the structural instabilities automatic YARA rule generators may face, on 71,000 malware binaries collected by AV companies from infected machines.

- **Approximate ground truth.** In-the-wild samples have no real ground-truth labels. Labeling strategies that produce more homogeneous clusters (e.g., code-similarity-based) outperform more heterogeneous ones (e.g., AV-label-based) in controlled settings, but they limit coverage of in-the-wild samples.
- **Algorithm choice.** Strategies for homogeneous and heterogeneous malware sets differ significantly. A Gaussian mixture model (GMM) consistently underestimates the number of clusters in heterogeneous sets compared to density-based methods (e.g., DBSCAN) or augmented K-Means.
- **Heterogeneity can help.** AV labels are poor approximations of ground truth for individual families, but they estimate cluster partitioning for heterogeneous datasets better than homogeneous approaches, recovering performance in challenging cases.

Methodological choices can lead to completely different conclusions, underestimating how reliable rule generation currently is and how much development the community still needs in this direction.
