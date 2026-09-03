---
title: "A Second Look at the Portability of Deep Learning Side-Channel Attacks over EM Traces"
collection: publications
category: conferences
permalink: /publication/2024-09-01-portability-deep-learning-side-channel-attacks-over-em-traces/
date: 2024-09-01
authors: "Mabon Ninan, Evan Nimmo, Shane Reilly, Channing Smith, Wenhai Sun, Boyang Wang, John M. Emmert"
venue: "27th International Symposium on Research in Attacks, Intrusions and Defenses (RAID '24)"
venue_short: "RAID '24"
venue_type: "Conference"
topics: "side-channel hardware-security deep-learning dataset"
paperurl: "https://doi.org/10.1145/3678890.3678900"
doi: "10.1145/3678890.3678900"
localpdf: "/files/cross_em.pdf"
github:
dataset_note: "Contributes a public dataset of 3 million EM traces across 9 probe locations and multiple targets."
summary: "Earlier portability results for EM side-channel attacks were established on easy targets such as 8-bit microcontrollers. This paper re-runs them on harder ones — 32-bit microcontrollers and traces with random delay — under domain shifts from hardware variation, different keys, and inconsistent probe placement. Pre-processing and unsupervised domain adaptation do help, but which method wins depends on the target and probe location, and none dominates: results from easy targets do not generalize. The paper also identifies two evaluation pitfalls that make cross-device attacks look better than they are, and releases a 3-million-trace public dataset."
abstract: "Deep learning side-channel attacks can recover encryption keys on a target by analyzing power consumption or electromagnetic (EM) signals. However, they are less portable when there are domain shifts between training and test data. While existing studies have shown that pre-processing and unsupervised domain adaptation can enhance the portability of deep learning side-channel attacks given domain shifts over EM traces, the findings are limited to easy targets (e.g., 8-bit microcontrollers). In this paper, we investigate the portability of deep learning side-channel attacks over EM traces acquired from more challenging targets, including 32-bit microcontrollers and EM traces with random delay. We study domain shifts introduced by the combination of hardware variations, distinct keys, and inconsistent probe locations between two targets. In addition, we perform comparative analyses of multiple existing (and new) pre-processing and unsupervised domain adaptation methods. We conduct a series of comprehensive experiments and derive three main observations. (1) Pre-processing and unsupervised domain adaptation methods can enhance the portability of deep learning side-channel attacks over more challenging targets. (2) The effectiveness of each method, however, varies depending on the target and probe locations in use. In other words, observations of a method on easy targets do not necessarily generalize to challenging targets. (3) None of the methods can constantly outperform others. Moreover, we highlight two types of pitfalls that could lead to over-optimistic attack results in cross-device evaluations. We also contribute a large-scale public dataset (with 3 million EM traces from 9 probe locations over multiple targets) for benchmarking and reproducibility of side-channel attacks tackling domain shifts over EM traces."
citation: "M. Ninan, E. Nimmo, S. Reilly, C. Smith, W. Sun, B. Wang, and J. M. Emmert, 'A Second Look at the Portability of Deep Learning Side-Channel Attacks over EM Traces,' Proceedings of the 27th International Symposium on Research in Attacks, Intrusions and Defenses (RAID '24), Padua, Italy, 2024, pp. 630-643. doi: 10.1145/3678890.3678900."
keywords:
  - "side-channel analysis"
  - "deep learning"
  - "domain adaptation"
  - "electromagnetic traces"
  - "public dataset"
---
