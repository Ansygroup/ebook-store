"""Full manuscript for Tech for Everyone — 10 chapters."""

CHAPTERS = [
    ("Tech Is a Language", [
        "You do not need to code to think in systems. Every technology — apps, websites, smart devices, AI — follows the same fundamental pattern: input, processing, output. Master this frame and the digital world stops feeling like magic and starts feeling legible.",
        "Inputs are what go in (taps, typing, sensors, uploads). Processing is what happens inside (calculations, storage, matching rules). Outputs are what come out (displays, sounds, actions). When anything confuses you, locate where in this chain it broke.",
        "Every app is a bet on a workflow: the designers predicted your needs and built a path. When software frustrates you, ask 'what workflow did they imagine?' Often the answer reveals a faster route hiding one menu away.",
        "Terminology is half the battle. Sync means copying between devices. Cloud means someone else's computer. Cache means a temporary local copy for speed. Learning fifty core terms unlocks understanding of ten thousand conversations.",
        "The vocabulary compounds: once 'account', 'permission', 'notification', and 'backup' feel concrete rather than mystical, every new app arrives half-understood. Technology fluency is language fluency wearing different clothes.",
    ]),
    ("Staying Safe Online", [
        "Strong unique passwords plus two-factor authentication defeats ninety percent of attacks. Use a password manager (Bitwarden, 1Password) to generate and remember everything unique; your memory was never designed for forty passwords.",
        "Two-factor authentication means a thief needs your password AND your phone. Enable it on email first (email resets everything else), then banking, then social media. Authenticator apps beat SMS codes because phone numbers can be hijacked.",
        "Phishing is the dominant attack: urgent messages pretending to be your bank, boss, or delivery service. The defense is skepticism of urgency plus independent verification. Never click login links from emails; navigate to sites yourself.",
        "Software updates patch security holes attackers actively exploit. Delaying updates leaves known doors open. Enable automatic updates everywhere and restart when asked — the inconvenience is minutes; the vulnerability window without patches is indefinite.",
        "Public Wi-Fi risks are real but manageable: avoid logging into sensitive accounts on shared networks, or use a reputable VPN. Assume anything typed on open networks could be observed, because sometimes it is.",
    ]),
    ("Understanding Your Devices", [
        "Phones and computers age through two separate mechanisms: hardware slowing and software bloating. Hardware ages over years; software bloat can be reversed. Restarting weekly, updating regularly, and deleting unused apps restore most sluggish devices.",
        "Storage full means performance suffers. Photos and videos consume most space on phones. Back up media to cloud or computer, then delete locally. Computers benefit similarly: uninstall unused programs, empty trash, clear downloads folders quarterly.",
        "Backups convert disasters into inconveniences. The rule of three: original file, local backup, offsite backup. Phones back up photos automatically to cloud — verify it is actually enabled before the day you need it.",
        "Learn your device's search function. Both phones and computers index everything; searching beats browsing through folders every time. Searching by content, not just filename, turns thousands of files from chaos into database.",
        "Settings menus contain the controls manufacturers bury: battery optimization details, privacy permissions per app, display accommodations. Spend one hour exploring settings once; save hundreds of hours and frustrations after.",
    ]),
    ("The Cloud Demystified", [
        "The cloud means someone else's computer running your files and services, accessed through the internet. Benefits: access anywhere, automatic backups, no maintenance. Trade-offs: requires internet, monthly costs, trusting providers with data.",
        "Cloud storage (Google Drive, iCloud, Dropbox) syncs files across devices automatically. Understand sync direction: deleting locally deletes in cloud too, unless the service keeps deleted files in trash for recovery periods.",
        "Cloud services run on subscriptions. Audit them yearly as with any recurring cost: which do you actually use? Families sharing plans (storage, streaming) cut per-person costs dramatically versus individual accounts.",
        "Cloud documents enable collaboration that email attachments never could. Shared documents update live for all editors, preserve version history, and eliminate 'final_v7_REAL_final.docx' archaeology forever.",
        "Privacy trade-offs deserve conscious decisions: convenience gained versus data shared. Read permission requests when apps ask; revoke access for apps abandoned long ago. Your data has value — spend it deliberately.",
    ]),
    ("Using AI Wisely", [
        "Treat AI assistants as fast, confident junior helpers: brilliant at drafts, summaries, brainstorming, and explanations; unreliable on facts, current events, and numbers. Verify anything consequential before trusting or repeating it.",
        "Prompting is instruction-writing. Specific requests produce specific results: 'write a friendly reminder email to a client about an unpaid invoice, three sentences, warm but firm' outperforms 'write about invoice' tenfold.",
        "AI excels at transforming text: summarizing long documents, translating tone (formal to casual), explaining jargon, restructuring bullets into prose. Feed it your writing and request transformations — this is its sweet spot.",
        "Never share sensitive data with public AI tools: passwords, financial details, client confidential information, medical records. Conversations may be stored and reviewed. Treat AI chats like postcards, not diaries.",
        "AI-generated content needs human review for accuracy and voice. It hallucinates confidently, cites non-existent sources, and averages toward blandness. Use it as a first-draft accelerator and thinking partner, never as final authority.",
    ]),
    ("Digital Organization", [
        "Digital clutter costs real time: searching for files, duplicating work, missing deadlines hidden in chaos. A simple system maintained loosely beats an elaborate system abandoned quickly.",
        "One inbox rule: everything lands in Downloads/Desktop temporarily, then gets filed or deleted within a week. Weekly ten-minute filing sessions prevent annual archaeology expeditions.",
        "Name files so future-you can find them: date-first format (2026-08-24 Invoice Company.pdf) sorts chronologically automatically. Descriptive names beat 'Document1' — future-you is a different person who owes nothing to past-you.",
        "Photos need curation, not hoarding. Delete obvious duplicates and failed shots monthly; favorite the keepers immediately. Cloud albums organized by event or year turn photo archives from burden back into joy.",
        "Email triage: unsubscribe ruthlessly from newsletters never read (every email has the link), use filters to auto-file known senders, and aim for inbox-zero-lite — respond, delegate, defer with a flag, or delete. Touch each email once.",
    ]),
    ("Troubleshooting Like a Pro", [
        "Ninety percent of tech problems yield to the sequence: restart the app, restart the device, check the internet connection, update the software. Perform these four steps before any support call and half the problems vanish.",
        "Read error messages literally. They usually state exactly what broke and often how. Screenshots of errors make support interactions five times more efficient than describing from memory.",
        "Search your exact error message online. Whatever obscure problem you face, someone worldwide hit it first, posted it on a forum, and received the fix. Copy-paste the error into a search engine — this solves most issues in minutes.",
        "Isolate variables systematically. Does the problem happen in another browser? Another device? Another network? Each yes/no answer halves the suspect list. Methodical elimination beats random clicking every time.",
        "Know when to escalate: after the basics fail and a targeted search fails, contact support with your documentation ready — error screenshots, what you tried, when it started. Prepared reports get solved; vague complaints get queued.",
    ]),
    ("Choosing New Technology", [
        "New devices and software should solve identified problems, not promise vague upgrades. Write down what frustrates you currently; buy specifically against that list. Marketing sells aspirations; wise purchases address actuals.",
        "Read reviews from multiple sources, prioritizing detailed ones from verified purchasers over star averages. Patterns across many reviews reveal truths; single glowing or furious reviews reveal individuals.",
        "Understand total cost: purchase price plus subscription requirements, accessories needed, learning curve investment. Cheap printers with expensive ink taught everyone this lesson — apply it to every gadget category.",
        "Buy slightly behind the bleeding edge. Last year's flagship performs ninety-five percent as well at sixty percent of price. Unless a specific new feature matters to you, maturity discounts are free money.",
        "Keep receipts and understand return windows. Technology purchases deserve real-world trials — compatibility surprises and usability disappointments emerge in days two through fourteen, not in store demonstrations.",
    ]),
    ("Tech Confidence Forever", [
        "Technology will keep changing; the fundamentals transfer permanently. Inputs, outputs, security habits, troubleshooting logic, and skeptical curiosity remain valuable across every platform shift. Invest in fundamentals; rent the specifics.",
        "Adopt one new tool deliberately each year. Choose something genuinely useful (a password manager, a note system, an automation), learn it properly for a month. Deliberate adoption builds adaptation muscle that generalizes.",
        "Teach others what you learn. Explaining technology to a friend or relative solidifies understanding and surfaces gaps. The person who teaches a smartphone feature understands it twice as well as the person who merely uses it.",
        "Curiosity beats fear in every interaction with new technology. Tap the button; see what happens. Most settings can be changed back, most actions undone, most questions answered. The fearful stay stuck; the curious compound skills.",
        "Technology serves goals you choose. The best-optimized digital life still requires deciding what actually matters — relationships, work quality, learning, rest. Tools amplify whatever direction you bring. Choose the direction first; then let tech carry you further, faster.",
    ]),
]
