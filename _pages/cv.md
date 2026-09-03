---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

<style>
  /* Uses the site's CSS custom properties (_sass/_tokens.scss) instead of
     hardcoded hex colors, so this page follows dark mode like everything
     else rather than always showing white cards. */
  .cv-page {
    line-height: 1.7;
    color: var(--text);
  }

  .cv-page h2 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    padding-bottom: 0.35rem;
    border-bottom: 1px solid var(--border);
    color: var(--text);
    font-family: var(--font-display);
    font-size: 1.18rem;
    letter-spacing: 0.01em;
  }

  .cv-page ul {
    padding-left: 1.15rem;
    margin-top: 0.45rem;
  }

  .cv-page li {
    margin-bottom: 0.45rem;
  }

  .cv-page .cv-summary {
    background: var(--accent-soft);
    border: 1px solid var(--accent-border);
    border-radius: var(--r-lg);
    padding: 1rem 1.1rem;
    margin: 0.2rem 0 1.1rem;
    box-shadow: var(--shadow-sm);
  }

  .cv-page .cv-summary p {
    margin: 0;
    color: var(--text-muted);
  }

  .cv-page .cv-section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 1rem 1.1rem;
    margin: 0.9rem 0 1.2rem;
    box-shadow: var(--shadow-sm);
  }

  .cv-page .cv-card {
    background: var(--surface-sunken);
    border: 1px solid var(--border);
    border-left: 4px solid var(--accent);
    border-radius: var(--r-md);
    padding: 0.95rem 1rem;
    margin: 0.8rem 0 1.1rem;
    box-shadow: var(--shadow-sm);
  }

  .cv-page .cv-card strong {
    color: var(--text);
  }

  .cv-page .cv-item-title {
    font-size: 1.02rem;
    margin-bottom: 0.25rem;
  }

  .cv-page .cv-meta {
    color: var(--text-muted);
    font-size: 0.95rem;
    display: block;
    margin: 0.15rem 0 0.25rem;
  }

  .cv-page .cv-footnote {
    color: var(--text-subtle);
    font-size: 0.95rem;
    margin-top: 0.2rem;
  }

  .cv-page .cv-entry {
    margin-bottom: 0.75rem;
  }

  .cv-page a {
    color: var(--accent-text);
  }
</style>

<div class="cv-page" markdown="1">

<div class="cv-summary">
  <p><strong>Research profile:</strong> machine learning and security, with a focus on side-channel analysis, malware detection, explainable AI, and student mentorship.</p>
</div>

<div class="cv-section" markdown="1">

## Education

- **Ph.D. in Computer Science**, Texas A&M University, Aug. 2024 – Present
  - Advisor: Dr. Marcus Botacin
  - Thesis: Algorithms and Advanced Machine Learning for Cybersecurity
  - Committee: Dr. James Caverlee, Dr. Nitesh Saxena, Dr. Eman Hammad

- **B.S. in Computer Engineering**, University of Cincinnati, Aug. 2020 – Apr. 2024
  - Summa Cum Laude (3.953/4.00)
  - Advisor: Dr. Boyang Wang
  - Thesis: Domain Adaptation for Deep Learning Models and Tiny Neural Networks

</div>

<div class="cv-section" markdown="1">

## Research Experience

- **Texas A&M University**, Research Assistant, Aug. 2024 – Present
  - Designing interpretable and robust malware detection methods for real-world deployment.
  - Developing agentic and LLM-assisted security systems for evolving cyber threats.
  - Investigating explainability and uncertainty in security models.

- **Cincinnati Children’s Hospital Medical Center**, Research Scientist, May 2024 – Aug. 2024
  - Built multimodal systems for pediatric chest X-ray report generation and evaluation.
  - Developed foundation models for CXR imaging and interpretable clinical AI.
  - Evaluated commercial NLP services and medical labelers on pediatric datasets.

- **University of Cincinnati**, Research Assistant, Jul. 2022 – Aug. 2024
  - Developed pruning methods that reduced model size by up to 98% for embedded deployment.
  - Explored domain adaptation, tiny neural networks, and side-channel trace analysis.
  - Supervised undergraduate students on a large public EM side-channel dataset.

</div>

<div class="cv-section" markdown="1">

## Publications


- **Mabon Ninan, Ryan Evans, Logan Reichling, Nirnimesh Ghose, Boyang Wang.** “TinyRadio: Tiny Neural Networks for Fingerprinting Radio Frequency Signals.” IEEE National Aerospace and Electronics Conference (NAECON), 2025. DOI: 10.1109/NAECON65708.2025.11235437.
- **Logan Reichling, Ryan Evans, Mabon Ninan, Phuc Mai, Boyang Wang, Yunsi Fei, John Emmert.** “MicroPower: Micro Neural Networks for Side-Channel Attacks.” In 2025 IEEE International Symposium on Hardware Oriented Security and Trust (HOST), 2025. DOI: 10.1109/HOST64725.2025.11050048.
- **Mabon Ninan, Evan Nimmo, Shane Reilly, Channing Smith, Wenhai Sun, Boyang Wang, John M. Emmert.** “A Second Look at the Portability of Deep Learning Side-Channel Attacks over EM Traces.” In RAID ’24: The 27th International Symposium on Research in Attacks, Intrusions and Defenses, pp. 630–643. ACM, 2024. DOI: 10.1145/3678890.3678900.
- **Haipeng Li, Mabon Ninan, Boyang Wang, John M. Emmert.** “TinyPower: Side-Channel Attacks with Tiny Neural Networks.” In 2024 IEEE International Symposium on Hardware Oriented Security and Trust (HOST), pp. 320–331. IEEE, 2024. DOI: 10.1109/HOST55342.2024.10545382.
- **Andrew Kosikowski, Daniel Cho, Mabon Ninan, Anca Ralescu, Boyang Wang.** “EvilELF: Evasion Attacks on Deep-Learning Malware Detection over ELF Files.” In 2023 International Conference on Machine Learning and Applications (ICMLA), pp. 1702–1709. IEEE, 2023. DOI: 10.1109/ICMLA58977.2023.00258.
- **Chenggang Wang, Mabon Ninan, Shane Reilly, Joel Ward, William Hawkins, Boyang Wang, John M. Emmert.** “Portability of Deep-Learning Side-Channel Attacks against Software Discrepancies.” In Proceedings of the 16th ACM Conference on Security and Privacy in Wireless and Mobile Networks (WiSec ’23), pp. 227–238. ACM, 2023. DOI: 10.1145/3558482.3590177.
- **Logan Reichling, Mabon Ninan, Boyang Wang, John M. Emmert.** “Deep Learning Side-Channel Attacks: Challenges and Opportunities.” Book chapter in Advancements in Hardware Design and Trust, 2026.
- **Shruti Hegde, Mabon Ninan, Jonathan R. Dillman, Shireen Hayatghaib, Elanchezhian Somasundaram.** “Evaluating Clinical NLP Services for Chest Radiograph Report Labeling: A Comparative Study on an Independent Pediatric Dataset.” Journal of Imaging Informatics in Medicine, June 2026.
- **Shruti Hegde, Mabon Ninan, Jonathan R. Dillman, Shireen Hayatghaibi, Lynn Babcock, Elanchezhian Somasundaram.** “Can Modern NLP Systems Reliably Annotate Chest Radiography Exams? A Pre-Purchase Evaluation and Comparative Study of Solutions from AWS, Google, Azure, John Snow Labs, and Open-Source Models on an Independent Pediatric Dataset.” DOI: 10.21203/rs.3.rs-6772394/v1.

</div>

<div class="cv-section" markdown="1">

## Talks

- CSCE Graduate Seminar, Texas A&M University, Feb. 2026
- AI for Cybersecurity Research, Texas A&M University, Feb. 2025
- RAID 2024, Padua, Italy, Sep. 2024
- IEEE HOST 2024, Washington, D.C., May 2024
- WiSec 2023, Guildford, United Kingdom, May 2023

</div>

<div class="cv-section" markdown="1">

## Academic Service

- PC Member, RAID 2026
- PC Member, RAID 2025
- Reviewer, Computers & Security (COSE), 2026
- PC Member, The 41st ACM/SIGAPP Symposium on Applied Computing
- Artifact Evaluator, CCS 2025

</div>

<div class="cv-section" markdown="1">

## Technical Skills

- **Languages:** Python, C/C++, Assembly, SQL
- **Machine Learning:** PyTorch, TensorFlow, Transformers, Scikit-learn, Computer Vision, NLP
- **Security & Tools:** Malware Analysis, Reverse Engineering (ELF), AWS, Google Cloud, Azure, Docker, Git, Linux

</div>

<div class="cv-section" markdown="1">

## Co-Advised Students

<div class="cv-card">
  <p class="cv-item-title"><strong>Selected undergraduate and REU mentees</strong></p>
  <ul>
    <li class="cv-entry">
      <strong><a href="https://scholar.google.com/citations?user=DnzsD78AAAAJ&hl=en">Ryan Evans</a></strong> — May 2023–June 2024, NSF REU Site, University of Cincinnati<br/>
      <span class="cv-meta">First job: Machine Learning Engineer, Medpace</span>
      <span class="cv-footnote">Papers: <a href="https://doi.org/10.1109/HOST64725.2025.11050048">MicroPower</a>; <a href="https://doi.org/10.1109/NAECON65708.2025.11235437">TinyRadio</a></span>
    </li>
    <li class="cv-entry">
      <strong><a href="https://www.linkedin.com/in/muhibkhn/">Muhib Khan</a></strong> — Dec. 2023–June 2024, University of Cincinnati, Class of 2025<br/>
      <span class="cv-meta">First job: Platform Engineer, IBM</span>
      <span class="cv-footnote">Paper contributions: not publicly listed yet.</span>
    </li>
    <li class="cv-entry">
      <strong><a href="https://www.linkedin.com/in/evan-nimmo/">Evan Nimmo</a></strong> — May 2023–July 2023, NSF REU Site, University of Cincinnati, Class of 2025<br/>
      <span class="cv-meta">First job: Junior Hardware Embedded Security Engineer, Riverside Research</span>
      <span class="cv-footnote">Paper: <a href="https://doi.org/10.1145/3678890.3678900">A Second Look at the Portability of Deep Learning Side-Channel Attacks over EM Traces</a></span>
    </li>
    <li class="cv-entry">
      <strong><a href="https://www.linkedin.com/in/andrew-kosikowski/">Andrew Kosikowski</a></strong> — May 2023–July 2023, NSF REU Site, Rose-Hulman Institute of Technology, Class of 2024<br/>
      <span class="cv-meta">First job: EO/IR Systems Engineer, MIT Lincoln Laboratory</span>
      <span class="cv-footnote">Paper: <a href="https://doi.org/10.1109/ICMLA58977.2023.00258">EvilELF: Evasion Attacks on Deep-Learning Malware Detection over ELF Files</a></span>
    </li>
    <li class="cv-entry">
      <strong><a href="https://www.linkedin.com/in/danieljunsangcho/">Daniel Cho</a></strong> — May 2023–July 2023, NSF REU Site, Hamilton College, Class of 2025<br/>
      <span class="cv-footnote">Paper: <a href="https://doi.org/10.1109/ICMLA58977.2023.00258">EvilELF: Evasion Attacks on Deep-Learning Malware Detection over ELF Files</a></span>
    </li>
  </ul>
</div>

</div>

<div class="cv-section" markdown="1">

## Mentoring

- Co-advised undergraduate researchers on side-channel security, malware analysis, and machine learning projects.
- Mentored students who have gone on to roles in industry and research labs.

</div>

</div>
