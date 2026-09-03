---
permalink: /
title: "Mabon Ninan"
# The hero below renders the name itself; this suppresses the layout's
# duplicate <h1> while keeping the title for SEO and the browser tab.
hide_page_title: true
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

{% include base_path %}

<div class="hero">
  <span class="hero__eyebrow">PhD Student &middot; Computer Science</span>

  <h1 class="hero__name">Mabon Ninan</h1>

  <p class="hero__role">
    Texas A&amp;M University, advised by <a href="https://marcusbotacin.github.io/"><strong>Dr. Marcus Botacin</strong></a>.
    Machine learning, cybersecurity, and trustworthy AI.
  </p>

  <p class="hero__pitch">
    I build security systems that still work when conditions are not ideal &mdash; when the
    threat landscape drifts, the signal is noisy, the hardware is tiny, or someone is
    actively trying to fool the model. That means malware detection you can interpret,
    side-channel analysis that transfers between real devices, neural networks small enough
    for a microcontroller, and clinical AI that holds up on the patients it was not
    trained on.
  </p>

  <div class="hero__actions">
    <a class="action action--primary" href="{{ base_path }}/publications/">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      Read the papers
    </a>
    <a class="action" href="{{ base_path }}/files/CV.pdf">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
      Download CV
    </a>
    <a class="action" href="mailto:{{ site.author.email }}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
      Get in touch
    </a>
    {% if site.author.googlescholar %}
      <a class="action action--ghost" href="{{ site.author.googlescholar }}">
        <i class="ai ai-google-scholar" aria-hidden="true"></i> Scholar
      </a>
    {% endif %}
  </div>
</div>

{% include metrics.html %}

<div class="section-head">
  <h2>Research</h2>
  <span class="section-head__meta">five threads</span>
</div>

<ul class="areas">
  <li class="area reveal">
    <span class="area__icon"><i class="fas fa-shield-halved" aria-hidden="true"></i></span>
    <h3 class="area__title">Robust &amp; Explainable Malware Detection</h3>
    <p class="area__body">Detectors that stay reliable as malware evolves, and that can say <em>why</em> they flagged something &mdash; a requirement for anyone who has to act on the alert.</p>
  </li>
  <li class="area reveal">
    <span class="area__icon"><i class="fas fa-robot" aria-hidden="true"></i></span>
    <h3 class="area__title">Agentic &amp; LLM-Assisted Security</h3>
    <p class="area__body">Self-healing and adaptive pipelines for security workflows, including where language models help an analyst and where they quietly mislead one.</p>
  </li>
  <li class="area reveal">
    <span class="area__icon"><i class="fas fa-wave-square" aria-hidden="true"></i></span>
    <h3 class="area__title">Side-Channel Attacks &amp; Defenses</h3>
    <p class="area__body">How physical leakage behaves across real hardware, and why attacks that look strong in one lab setup often fail on the next device.</p>
  </li>
  <li class="area reveal">
    <span class="area__icon"><i class="fas fa-microchip" aria-hidden="true"></i></span>
    <h3 class="area__title">Tiny Neural Networks</h3>
    <p class="area__body">Compressing models far enough to run on constrained and embedded devices &mdash; which changes what a resource-limited attacker or defender can do.</p>
  </li>
  <li class="area reveal">
    <span class="area__icon"><i class="fas fa-lungs" aria-hidden="true"></i></span>
    <h3 class="area__title">Multimodal Medical AI</h3>
    <p class="area__body">Interpretable models for pediatric chest radiography and clinical report understanding, evaluated on the populations that actually get scanned.</p>
  </li>
</ul>

<div class="section-head">
  <h2>Selected work</h2>
  <span class="section-head__meta"><a href="{{ base_path }}/publications/">all {{ site.data.metrics.publications_total }} publications &rarr;</a></span>
</div>

<ul class="pub-list">
  {% assign featured = "TinyPower: Side-Channel Attacks with Tiny Neural Networks,A Second Look at the Portability of Deep Learning Side-Channel Attacks over EM Traces,MicroPower: Micro Neural Networks for Side-Channel Attacks" | split: "," %}
  {% for name in featured %}
    {% assign match = site.publications | where: "title", name | first %}
    {% if match %}{% include publication-card.html post=match %}{% endif %}
  {% endfor %}
</ul>

<div class="section-head">
  <h2>Education</h2>
</div>

<ul class="timeline">
  <li class="tl">
    <span class="tl__when">Aug 2024 &mdash; Present</span>
    <p class="tl__what">Ph.D., Computer Science</p>
    <p class="tl__where">Texas A&amp;M University</p>
    <div class="tl__detail">
      Advised by Dr. Marcus Botacin. Thesis: <em>Algorithms and Advanced Machine Learning for Cybersecurity</em>.
      Committee: Dr. James Caverlee, Dr. Nitesh Saxena, Dr. Eman Hammad.
    </div>
  </li>
  <li class="tl">
    <span class="tl__when">Aug 2020 &mdash; Apr 2024</span>
    <p class="tl__what">B.S., Computer Engineering &mdash; Summa Cum Laude</p>
    <p class="tl__where">University of Cincinnati &middot; 3.953 / 4.00</p>
    <div class="tl__detail">
      Advised by Dr. Boyang Wang. Thesis: <em>Domain Adaptation for Deep Learning Models and Tiny Neural Networks</em>.
    </div>
  </li>
</ul>

<div class="section-head">
  <h2>Research experience</h2>
</div>

<ul class="timeline">
  <li class="tl">
    <span class="tl__when">2024 &mdash; Present</span>
    <p class="tl__what">Research Assistant</p>
    <p class="tl__where">Texas A&amp;M University</p>
    <div class="tl__detail">
      <ul>
        <li>Interpretable malware detection for zero-overhead, real-world deployment.</li>
        <li>Multi-model machine learning for software-based malware detection.</li>
        <li>Agentic malware detection and robust LLM-based analysis pipelines.</li>
        <li>Explainability and uncertainty in security models.</li>
      </ul>
    </div>
  </li>
  <li class="tl">
    <span class="tl__when">May 2024 &mdash; Aug 2024</span>
    <p class="tl__what">Research Scientist</p>
    <p class="tl__where">Cincinnati Children's Hospital Medical Center</p>
    <div class="tl__detail">
      <ul>
        <li>Multimodal systems for evaluating chest X-ray report generation.</li>
        <li>Foundation models for pediatric CXR imaging and interpretable clinical AI.</li>
        <li>Evaluation of commercial NLP services and medical labelers on pediatric data.</li>
      </ul>
    </div>
  </li>
  <li class="tl">
    <span class="tl__when">Jul 2022 &mdash; Aug 2024</span>
    <p class="tl__what">Research Assistant</p>
    <p class="tl__where">University of Cincinnati</p>
    <div class="tl__detail">
      <ul>
        <li>Pruning methods that cut model size by up to 98% for embedded deployment.</li>
        <li>Domain adaptation, tiny neural networks, and side-channel trace analysis.</li>
        <li>Supervised undergraduates on a large public EM side-channel dataset.</li>
      </ul>
    </div>
  </li>
</ul>

<div class="section-head">
  <h2>Recognition &amp; service</h2>
</div>

<div class="areas">
  <div class="area">
    <h3 class="area__title">Awards</h3>
    <p class="area__body">
      <span class="badge badge--award">Best Student Paper</span> IEEE HOST 2024<br>
      <span class="badge">Fellowship</span> Undergraduate Research Fellowship, University of Cincinnati &mdash; 2022, 2023, 2024
    </p>
  </div>
  <div class="area">
    <h3 class="area__title">Program committees</h3>
    <p class="area__body">RAID 2026 &middot; RAID 2025 &middot; DSN 2026 &middot; ACM/SIGAPP SAC 41 &middot; Artifact Evaluator, CCS 2025</p>
  </div>
  <div class="area">
    <h3 class="area__title">Reviewing</h3>
    <p class="area__body">Computers &amp; Security (COSE), 2026</p>
  </div>
</div>

<div class="section-head">
  <h2>Technical skills</h2>
</div>

<div class="stack-sm">
  <p><strong>Languages</strong> &nbsp; Python &middot; C/C++ &middot; Assembly &middot; SQL</p>
  <p><strong>Machine learning</strong> &nbsp; PyTorch &middot; TensorFlow &middot; Transformers &middot; Scikit-learn &middot; Computer Vision &middot; NLP</p>
  <p><strong>Security &amp; infrastructure</strong> &nbsp; Malware analysis &middot; ELF reverse engineering &middot; AWS &middot; Google Cloud &middot; Azure &middot; Docker &middot; Git &middot; Linux</p>
</div>

<div class="section-head">
  <h2>Contact</h2>
</div>

<p>
  For collaborations, questions, or just to connect &mdash;
  <a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a>.
</p>
