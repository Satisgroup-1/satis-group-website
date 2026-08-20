// Legal/compliance pages, transcribed from the supplied Word documents:
//   - SATIS Group Terms & Conditions V1
//   - SATIS Group Privacy Policy V1
//   - Modern Slavery Statement
// The wording is kept verbatim from those documents, except that plain
// typos in the Modern Slavery Statement were corrected on request; update
// the source document and this file together.

export type LegalBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] };

export type LegalPage = {
  slug: string;
  title: string;
  /** Short label used in the footer link row. */
  shortTitle: string;
  intro: string;
  blocks: LegalBlock[];
};

export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: "terms",
    title: "Website User Terms and Conditions",
    shortTitle: "Terms & Conditions",
    intro:
      "RA Developments (NW) Limited (trading as SATIS Group)",
    blocks: [
      { kind: "heading", text: "Introduction" },
      {
        kind: "paragraph",
        text: "Welcome to the SATIS Group website. If you continue to browse or use this website you are agreeing to comply with and be bound by the following terms and conditions of use (“Terms”) which govern our relationship with you in relation to this website. If you disagree with any part of these Terms, please do not use our website.",
      },
      {
        kind: "paragraph",
        text: "The term “we” or “SATIS Group” means RA Developments (NW) Limited, the owner and operator of the website www.satisgroup.co.uk (the “Website”), whose registered office is Peel House, 30 The Downs, Altrincham, Cheshire, WA14 2PX and whose company registration number is 13192451 (“us” and “our” will be construed accordingly).",
      },
      {
        kind: "paragraph",
        text: "The term “you” refers to the user or viewer of our Website (and “your” will be construed accordingly).",
      },
      {
        kind: "paragraph",
        text: "This Website uses cookies. By using this Website and agreeing to these Terms, you consent to our use of cookies in accordance with the terms of our Cookies Policy and to the use of your information in accordance with our Privacy Policy.",
      },
      { kind: "heading", text: "Use of this Website" },
      {
        kind: "paragraph",
        text: "You must be over 18 years of age to participate in any offerings or services which are shown on our Website.",
      },
      {
        kind: "paragraph",
        text: "Unless otherwise stated, SATIS Group owns the intellectual property rights in the Website and material on the Website. Subject to the license below, all these intellectual property rights are reserved.",
      },
      {
        kind: "paragraph",
        text: "You may view Website pages, download Website pages and print Website pages, subject to the restrictions set out below and elsewhere in these Terms. You are not permitted to share, distribute or republish any parts of the website without our express consent.",
      },
      {
        kind: "paragraph",
        text: "You must not use our Website in any way that causes, or may cause, damage to the Website or impairment of the availability or accessibility of the Website; or in any way which is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity.",
      },
      {
        kind: "paragraph",
        text: "You must not use this Website to copy, store, host, transmit, send, use, publish or distribute any material which consists of malicious computer software.",
      },
      {
        kind: "paragraph",
        text: "You must not use our Website to transmit or send unsolicited commercial communications.",
      },
      {
        kind: "paragraph",
        text: "You must not use our Website for any purposes related to sales or marketing of our content or materials without our express written consent.",
      },
      {
        kind: "paragraph",
        text: "The content provided on our Website is for information purposes only. It is not intended that you place reliance on this information and we shall not be liable for its accuracy or for it being up-to-date. No claims may be brought against us due to any information or content found on this Website.",
      },
      {
        kind: "heading",
        text: "Investor Status and Financial Services Disclaimer",
      },
      {
        kind: "paragraph",
        text: "The content of this website has not been approved by an authorised person within the meaning of the Financial Services and Markets Act 2000. No reliance should be placed by you upon information contained on this website for the purpose of engaging in any investment activity. To do so, may expose you to a significant risk of losing any or all property or other assets invested. This warning is given pursuant to the Financial Services and Markets Act 2000 (Financial Promotion) Order 2005 (the “Regulations”).",
      },
      {
        kind: "paragraph",
        text: "The communication and any information which is provided to you on this website is exempt from the general restriction contained in Section 21 of the Financial Services and Markets Act 2000 (the “Act”) on the communication of invitations or inducements to engage in investment activity on the grounds that it is made only to:",
      },
      {
        kind: "list",
        items: [
          "High Net Worth Investor: An individual who has signed, within the period of twelve months ending with the day on which communication is made, a statement to confirm they have an annual income of not less than £100,000, or net assets, excluding their primary residence, of not less than £250,000.",
          "Certified Sophisticated Investor: An individual who has a written certificate within the last 36 months by an FCA Approved Person confirming that the Investor is sufficiently knowledgeable to understand the risks associated with engaging in investment activity in non-mainstream pooled investments.",
          "Self-Certified Sophisticated Investor: An individual who has signed, within the period of twelve months ending with the day on which communication is made, a statement to confirm that they have sufficient knowledge to understand the risks associated with engaging in investment activity in non-mainstream pooled investments.",
        ],
      },
      {
        kind: "paragraph",
        text: "We shall verify all prospective investors’ status prior to delivering any financial promotions or details of investment opportunities.",
      },
      {
        kind: "paragraph",
        text: "You confirm that you are one of these types of investors. If you do not meet any of these criteria, you must not view this website.",
      },
      { kind: "heading", text: "Members Area" },
      {
        kind: "paragraph",
        text: "Access to certain areas of this Website is restricted. We reserve the right to restrict access to areas of this Website, or indeed this entire Website, at our sole discretion.",
      },
      {
        kind: "paragraph",
        text: "If we provide you with a user ID and password to enable you to access restricted areas of this Website or other content or services, you must ensure that the user ID and password are kept confidential. You are not permitted to give access to, or allow your account to be accessed by, any other person.",
      },
      {
        kind: "paragraph",
        text: "We may disable your user ID and password at our sole discretion without prior notice, if we believe you are making improper use of the Website.",
      },
      {
        kind: "paragraph",
        text: "All information contained in the restricted Members Areas (the “Confidential Information”) is owned by SATIS Group. By accessing the Members Area you agree:",
      },
      {
        kind: "list",
        items: [
          "(a) to keep the Confidential Information secret and not disclose it to any third party without the consent of SATIS Group;",
          "(b) to use the Confidential Information only for the purpose of considering whether you wish to enter into any transactions with SATIS Group;",
          "(c) on written notice from SATIS Group to return or destroy (which shall for the purpose of electronically held information mean irretrievably deleting such information from your computer systems) all Confidential Information and provide to SATIS Group written notice confirming the same;",
          "(d) that the Confidential Information is provided without representation or warranty as to accuracy or completeness, except as may subsequently be agreed in formal written agreements; and",
          "(e) that Confidential Information disclosed under this agreement may be highly sensitive or commercially valuable and its unauthorised disclosure may be highly damaging to the business interests of SATIS Group. Accordingly, you acknowledge that damages may not be an adequate remedy for breach of this agreement and you therefore accept that injunctive relief may be obtained by SATIS Group against actual or threatened breach of these terms.",
        ],
      },
      { kind: "heading", text: "Copyright and Licence" },
      {
        kind: "paragraph",
        text: "This Website contains material which is owned by or licensed to us. This material includes, but is not limited to, the content, design, layout, look, appearance and graphics and all of the material available whether for free or for purchase through the Website.",
      },
      {
        kind: "paragraph",
        text: "All material contained in this Website is and shall remain at all times the copyright of SATIS Group.",
      },
      {
        kind: "paragraph",
        text: "You must retain, and must not delete or remove all copyright notices and other proprietary notices placed by us on any material.",
      },
      { kind: "heading", text: "User Content" },
      {
        kind: "paragraph",
        text: "The Website may in the future provide comment or discussion forums which allow the submission of text, images, videos or other content by you and other users (\"User Content\") and the hosting and publishing of such User Content. You understand that whether or not such User Content are published, we do not guarantee any confidentiality with respect to any User Content.",
      },
      {
        kind: "paragraph",
        text: "You shall be solely responsible for your own User Content and the consequences of posting or publishing them.",
      },
      { kind: "paragraph", text: "You represent and warrant that:" },
      {
        kind: "list",
        items: [
          "you own or have the necessary rights and permissions to use and authorize us to use all copyright, trademark or other proprietary rights in and to any User Content to enable inclusion and use on the Website and in accordance with these Terms; and",
          "whilst, you retain all of your ownership rights in your User Content, by submitting the User Content to us, you hereby grant us, in addition to any other rights which we may have, a worldwide, non-exclusive and transferable license to use, copy, prepare derivative works of, display and broadcast the User Content in connection with the Website and our business, including without limitation to grant access to the Website to third parties to view the User Content (and derivative works thereof).",
          "you will not: (i) submit material that is false or misleading copyrighted, protected by trade secret or otherwise subject to third party proprietary rights, including privacy and publicity rights, unless you are the owner of such rights or have permission from their rightful owner to post the User Content and to grant us all of the license rights granted herein; (ii) publish falsehoods or misrepresentations that could damage us, our business or any third party; (iii) submit material that is unlawful, obscene, libelous, threatening, pornographic, or encourages conduct that would be considered a criminal offense, give rise to civil liability, violate any law, or (iv) misidentify yourself in submitting the User Content or misstate your true identity.",
        ],
      },
      {
        kind: "paragraph",
        text: "Any breach of the above warranties will result in the user’s account being immediately terminated and may result in the user becoming liable to legal action.",
      },
      {
        kind: "paragraph",
        text: "We do not endorse any User Content or any opinion, recommendation, or advice expressed therein, and we expressly disclaim any and all liability in connection with User Content. You understand that when using the Website, you will be exposed to User Content from a variety of sources, and that we are not responsible for the accuracy, usefulness, safety, or intellectual property rights of or relating to such User Content. You may be exposed to User Content that is inaccurate, offensive, indecent, or objectionable, and you agree to waive, and hereby do waive, any legal or equitable rights or remedies you may have against us with respect thereto, and agree to indemnify and hold us, our owners, affiliates, employees, agents and/or licensors, harmless to the fullest extent allowed by law regarding all matters related to your use of the Website.",
      },
      { kind: "heading", text: "No Warranties" },
      {
        kind: "paragraph",
        text: "This Website is provided “as is” without any representations or warranties, express or implied. We make no representations or warranties in relation to this Website or the information and material provided on this Website.",
      },
      {
        kind: "paragraph",
        text: "We do not warrant that this Website will be constantly available, or available at all; or that the information on this Website is complete, true, accurate or non-misleading.",
      },
      {
        kind: "paragraph",
        text: "Nothing on this Website constitutes, or is meant to constitute, advice of any kind. We do not provide any warranty as to the suitability of the information and material found or offered on this Website for any particular purpose. Your use of any information or material on this Website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any materials, services or information available through this Website meet your own specific requirements and you should take your own personal legal, accounting and tax advice before making any investment decision.",
      },
      {
        kind: "paragraph",
        text: "You acknowledge that information and material found or offered on this Website may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.",
      },
      {
        kind: "paragraph",
        text: "To the maximum extent permitted by applicable law we exclude all representations, warranties and conditions relating to this Website and the use of this Website (including, without limitation, any warranties implied by law of satisfactory quality, fitness for purpose and/or the use of reasonable care and skill).",
      },
      { kind: "heading", text: "Limitations and Exclusions of Liability" },
      {
        kind: "paragraph",
        text: "To the extent that the Website and the information and services on the Website are provided, our liability to you in relation to the use of our Website or under or in connection with these Terms, whether in contract, tort (including negligence) or otherwise, will be limited as follows: SATIS Group and its employees, agents and contractors will not be liable to you for any loss or damage of any nature whether arising directly or indirectly from the use of or reliance on information obtained from this Website. SATIS Group and its employees, agents and contractors will not be liable for any consequential, indirect or special loss or damage and will not be liable for any loss of profit, income, revenue, anticipated savings, contracts, business, goodwill, reputation, data, or information.",
      },
      {
        kind: "paragraph",
        text: "Nothing in these Terms will limit or exclude our liability for death or personal injury resulting from negligence, limit or exclude our liability for fraud or fraudulent misrepresentation or limit any of our liabilities in any way that is not permitted under applicable law.",
      },
      {
        kind: "paragraph",
        text: "By using this Website, you agree that the exclusions and limitations of liability set out in these Terms are reasonable. If you do not think they are reasonable, you must not use this Website.",
      },
      { kind: "heading", text: "Indemnity" },
      {
        kind: "paragraph",
        text: "If you breach these Terms you will be held fully responsible for any loss suffered by us as result of such breach and will be held accountable for all losses caused or profits gained by you from breaching these Terms.",
      },
      {
        kind: "paragraph",
        text: "You agree to indemnify us and undertake to keep us indemnified against any losses, damages, costs, liabilities and expenses (including, without limitation, legal expenses) incurred or suffered by us arising out of any breach by you of any provision of these Terms.",
      },
      { kind: "heading", text: "Other Websites" },
      {
        kind: "paragraph",
        text: "This Website may contain links to other websites that are not under the control of and are not maintained by us. We are not responsible for the content or reliability of the linked websites. We provide these links for your convenience only but do not endorse the material on those sites.",
      },
      { kind: "heading", text: "Waiver" },
      {
        kind: "paragraph",
        text: "The failure by us to enforce at any time or for any period any one or more of the Terms shall not be a waiver of them or the right at any time subsequently to enforce all Terms.",
      },
      { kind: "heading", text: "Severance" },
      {
        kind: "paragraph",
        text: "If any provision of these Terms shall be found by any court to be invalid or unenforceable, such invalidity or unenforceability shall not affect the other provisions of these Terms which shall remain in full force and effect.",
      },
      {
        kind: "paragraph",
        text: "If any provision of these Terms is so found to be invalid or unenforceable but would be valid or enforceable if some part of the provision were deleted, the provision in question shall apply with such modification(s) as may be necessary to make it valid and enforceable.",
      },
      { kind: "heading", text: "Variation" },
      {
        kind: "paragraph",
        text: "We may revise these Terms from time-to-time. Revised Terms will apply to the use of our Website from the date of the publication of the revised Terms on our Website. Please check this page regularly to ensure you are familiar with the current version.",
      },
      { kind: "heading", text: "Exclusion of Third Party Rights" },
      {
        kind: "paragraph",
        text: "These Terms are for the benefit of you and us, and are not intended to benefit any third party or be enforceable by any third party. The exercise of our and your rights in relation to these Terms is not subject to the consent of any third party.",
      },
      { kind: "heading", text: "Entire Agreement" },
      {
        kind: "paragraph",
        text: "These Terms constitute the entire agreement between you and us in relation to your use of our Website, and supersede all previous agreements in respect of your use of this Website.",
      },
      { kind: "heading", text: "Jurisdiction and Governing Law" },
      {
        kind: "paragraph",
        text: "These Terms shall be governed by and construed in accordance with English law. Any dispute, claim or matter arising out of, or relating to, these Terms shall be subject to the exclusive jurisdiction of the English courts.",
      },
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    shortTitle: "Privacy Policy",
    intro: "RA Developments (NW) Ltd (Trading as SATIS Group)",
    blocks: [
      { kind: "heading", text: "1. Introduction" },
      {
        kind: "paragraph",
        text: "1.1 We are committed to safeguarding the privacy of our users. This policy is designed to ensure that we safely handle your personal data in accordance with relevant regulations and legislation such as Data Protection Act 1998 and EU General Data Protection Regulations 2018 (the “Data Protection Regulations”).",
      },
      {
        kind: "paragraph",
        text: "1.2 This policy applies in those cases where we act as a data controller for the personal data of our website visitors and service users. This means those cases where we can decide the purposes and method of processing your personal data.",
      },
      {
        kind: "paragraph",
        text: "1.3 By using our website, you are agreeing to the terms of this policy.",
      },
      {
        kind: "paragraph",
        text: "1.4 These privacy rules explain what data we may collect from you, what we will do with that data and explains how you can limit the publication of your information and how you can choose whether or not you would like to receive direct marketing communications.",
      },
      {
        kind: "paragraph",
        text: "1.5 In this policy, \"we\", \"us\" and \"our\" refer to RA Developments (NW) Limited. Further details about us can be found below, in section 10 of this Privacy Policy.",
      },
      {
        kind: "paragraph",
        text: "1.6 We reserve the right to update and make changes to this Privacy Policy from time to time. You should check back regularly to ensure that you are up to date with any changes to this policy. Any changes posted will have effect from the date of such posting.",
      },
      { kind: "heading", text: "2. How we use your personal data" },
      { kind: "paragraph", text: "2.1 In this Section 2 we set out:" },
      {
        kind: "list",
        items: [
          "(a) the general categories of personal data that we may process;",
          "(b) the purposes for which we may process personal data; and",
          "(c) the legal basis of the processing in each case.",
        ],
      },
      {
        kind: "paragraph",
        text: "2.2 We may process data about your use of our website and services (\"usage data\"). The usage data may include your IP address, geographical location, browser type and version, operating system, referral source, length of visit, page views and website navigation paths, as well as information about the timing, frequency and pattern of your website or service use. The source of the usage data is our analytics tracking system. This usage data may be processed for the purposes of analysing the use of the website and services. The legal basis for this processing is either your specific consent or where we are not legally required to ask for consent, we may process this data for our legitimate interests, namely monitoring and improving our website and services.",
      },
      {
        kind: "paragraph",
        text: "2.3 We may process your account data (\"account data\"). The account data may include your name, email address, contact phone number and postal address. The account data may be processed for the purposes of operating our website, providing our services, ensuring the security of our website and services, maintaining back-ups of our databases and communicating with you. The legal basis for this processing is either your specific consent or where we are not legally required to ask for consent, we may process this data for our legitimate interests, namely monitoring and improving our website and services.",
      },
      {
        kind: "paragraph",
        text: "2.4 We may process any of your personal data identified in this policy where necessary for administrative purposes including in the exercise or defence of legal claims. The legal basis for this processing is our legitimate interests, namely for administrative record keeping, processing transactions and maintaining business records or for the protection and assertion of our legal rights.",
      },
      {
        kind: "paragraph",
        text: "2.5 If you supply any other person's personal data to us, you must do so only if you have the authority of such person to do so and you must comply with any obligations imposed upon you under the Data Protection Regulations.",
      },
      { kind: "heading", text: "3. Providing your personal data to others" },
      {
        kind: "paragraph",
        text: "3.1 We may disclose your personal data to any member of our group of companies (this means our subsidiaries, our holding company and its subsidiaries) insofar as reasonably necessary for the purposes, and on the legal bases, set out in this policy.",
      },
      {
        kind: "paragraph",
        text: "3.2 We may disclose your personal data to our insurers and/or professional advisers insofar as reasonably necessary for the purposes of obtaining or maintaining insurance coverage, managing risks, obtaining professional advice, or to exercise or defend legal claims.",
      },
      {
        kind: "paragraph",
        text: "3.3 We may pass your personal information to credit reference agencies or other agencies that provide services to verify your identity or for any other checks or searches required by legislation or our regulators relating to money laundering. These agencies may keep a record of any search that they do.",
      },
      {
        kind: "paragraph",
        text: "3.4 We may outsource or contract the provision of IT services to third parties. If we do, those third parties may hold and process your personal data. In these circumstances, we will require that the IT supplier only processes your personal data for us, as directed by us, and in accordance with the Data Protection Regulations.",
      },
      {
        kind: "paragraph",
        text: "3.5 If we sell all or part of our business, we may pass your personal data to the purchaser. In these circumstances, we will require the purchaser to contact you after completion of the sale to inform you of the identity of the purchaser.",
      },
      {
        kind: "paragraph",
        text: "3.6 In addition to the specific disclosures of personal data set out in this Section 3, we may disclose your personal data where such disclosure is necessary for compliance with a legal obligation to which we are subject, or in order to protect your legal interests or the legal interests of another person.",
      },
      {
        kind: "heading",
        text: "4. International transfers of your personal data",
      },
      {
        kind: "paragraph",
        text: "4.1 In this Section 4, we provide information about the circumstances in which your personal data may be transferred to countries outside the UK and/or the European Economic Area (EEA).",
      },
      {
        kind: "paragraph",
        text: "4.2 Unless such transfer is made with your consent, or is required in order to fulfil the terms of any services requested from us, we will not transfer any of your personal data to any country outside the UK or the EEA unless such transfer is to an organisation which provides adequate safeguards in compliance with the Data Protection Regulations.",
      },
      {
        kind: "paragraph",
        text: "4.3 You acknowledge that personal data that you submit for publication through our website or services may be available, via the internet, around the world. We cannot prevent the use (or misuse) of such personal data by others.",
      },
      { kind: "heading", text: "5. Retaining and deleting personal data" },
      {
        kind: "paragraph",
        text: "5.1 This Section 5 sets out our data retention policies and procedure, which are designed to help ensure that we comply with our legal obligations in relation to the retention and deletion of personal data.",
      },
      {
        kind: "paragraph",
        text: "5.2 Personal data that we process for any purpose shall not be kept for longer than is necessary for that purpose. This means that unless there is a good reason to do so we won't keep your personal data more than 6 years after our business relationship has ended.",
      },
      {
        kind: "paragraph",
        text: "5.3 Notwithstanding the other provisions of this Section 5, we may retain your personal data where such retention is necessary for compliance with a legal obligation to which we are subject, or in order to protect your legal interests or the legal interests of another person.",
      },
      { kind: "heading", text: "6. Amendments" },
      {
        kind: "paragraph",
        text: "6.1 We may update this policy from time to time by publishing a new version on our website.",
      },
      {
        kind: "paragraph",
        text: "6.2 You should check this page occasionally to ensure you are happy with any changes to this policy.",
      },
      {
        kind: "paragraph",
        text: "6.3 We may notify you of changes to this policy by email or through the private messaging system on our website.",
      },
      { kind: "heading", text: "7. Your rights" },
      {
        kind: "paragraph",
        text: "7.1 In this Section 7, we have summarised the rights that you have under data protection law. Some of the rights are complex, and not all of the details have been included in our summaries. Accordingly, you should read the relevant laws and guidance from the regulatory authorities for a full explanation of these rights.",
      },
      {
        kind: "paragraph",
        text: "7.2 Your principal rights under data protection law are:",
      },
      {
        kind: "list",
        items: [
          "(a) the right to access;",
          "(b) the right to rectification;",
          "(c) the right to erasure;",
          "(d) the right to restrict processing;",
          "(e) the right to object to processing;",
          "(f) the right to data portability;",
          "(g) the right to complain to a supervisory authority; and",
          "(h) the right to withdraw consent.",
        ],
      },
      {
        kind: "paragraph",
        text: "7.3 You have the right to confirmation as to whether or not we process your personal data and, where we do, access to the personal data, together with certain additional information. That additional information includes details of the purposes of the processing, the categories of personal data concerned and the recipients of the personal data. Providing the rights and freedoms of others are not affected, we will supply to you a copy of your personal data, as described below (clause 7.13).",
      },
      {
        kind: "paragraph",
        text: "7.4 You have the right to have any inaccurate personal data about you rectified and, taking into account the purposes of the processing, to have any incomplete personal data about you completed.",
      },
      {
        kind: "paragraph",
        text: "7.5 In some circumstances you have the right to the erasure of your personal data without undue delay. Those circumstances include: the personal data is no longer necessary in relation to the purposes for which it was collected or otherwise processed; you withdraw consent to consent-based processing; you object to the processing under certain rules of applicable data protection law; the processing is for direct marketing purposes; and the personal data have been unlawfully processed. However, there are exclusions of the right to erasure. The general exclusions include where processing is necessary: for exercising the right of freedom of expression and information; for compliance with a legal obligation; or for the establishment, exercise or defence of legal claims.",
      },
      {
        kind: "paragraph",
        text: "7.6 In some circumstances you have the right to restrict the processing of your personal data. Those circumstances are: you contest the accuracy of the personal data; processing is unlawful but you oppose erasure; we no longer need the personal data for the purposes of our processing, but you require personal data for the establishment, exercise or defence of legal claims; and you have objected to processing, pending the verification of that objection. Where processing has been restricted on this basis, we may continue to store your personal data. However, we will only otherwise process it: with your consent; for the establishment, exercise or defence of legal claims; for the protection of the rights of another natural or legal person; or for reasons of important public interest.",
      },
      {
        kind: "paragraph",
        text: "7.7 You have the right to object to our processing of your personal data on grounds relating to your particular situation, but only to the extent that the legal basis for the processing is that the processing is necessary for: the performance of a task carried out in the public interest or in the exercise of any official authority vested in us; or the purposes of the legitimate interests pursued by us or by a third party. If you make such an objection, we will cease to process the personal information unless we can demonstrate compelling legitimate grounds for the processing which override your interests, rights and freedoms, or the processing is for the establishment, exercise or defence of legal claims.",
      },
      {
        kind: "paragraph",
        text: "7.8 You have the right to object to our processing of your personal data for direct marketing purposes (including profiling for direct marketing purposes). If you make such an objection, we will cease to process your personal data for this purpose.",
      },
      {
        kind: "paragraph",
        text: "7.9 You have the right to object to our processing of your personal data for scientific or historical research purposes or statistical purposes on grounds relating to your particular situation, unless the processing is necessary for the performance of a task carried out for reasons of public interest.",
      },
      {
        kind: "paragraph",
        text: "7.10 To the extent that the legal basis for our processing of your personal data is: (a) consent; or (b) that the processing is necessary for the performance of a contract to which you are party or in order to take steps at your request prior to entering into a contract, and such processing is carried out by automated means, you have the right to receive your personal data from us in a structured, commonly used and machine-readable format. However, this right does not apply where it would adversely affect the rights and freedoms of others.",
      },
      {
        kind: "paragraph",
        text: "7.11 If you consider that our processing of your personal information infringes data protection laws, you have a legal right to lodge a complaint with a supervisory authority responsible for data protection in the UK, this is the Information Commissioner’s Office (the ICO). For further details, please go to www.ico.org.uk.",
      },
      {
        kind: "paragraph",
        text: "7.12 To the extent that the legal basis for our processing of your personal information is consent, you have the right to withdraw that consent at any time. Withdrawal will not affect the lawfulness of processing before the withdrawal.",
      },
      {
        kind: "paragraph",
        text: "7.13 You may request that we provide you with any personal information we hold about you. Provision of this information will be subject to the supply of appropriate evidence of your identity (for this purpose, we will usually accept a photocopy of your passport certified by a solicitor or bank plus an original copy of a utility bill showing your current address).",
      },
      { kind: "heading", text: "8. About cookies" },
      {
        kind: "paragraph",
        text: "8.1 A cookie is a small file containing an identifier (a string of letters and numbers) that is sent by a web server to a web browser asking permission to be placed on your computer's hard drive. The file is added and the cookie helps analyse web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.",
      },
      {
        kind: "paragraph",
        text: "8.2 Cookies may be either \"persistent\" cookies or \"session\" cookies: a persistent cookie will be stored by a web browser and will remain valid until its set expiry date, unless deleted by the user before the expiry date; a session cookie, on the other hand, will expire at the end of the user session, when the web browser is closed.",
      },
      {
        kind: "paragraph",
        text: "8.3 Cookies do not typically contain any information that personally identifies a user, but personal information that we store about you may be linked to the information stored in and obtained from cookies.",
      },
      { kind: "heading", text: "9. Cookies that we use" },
      {
        kind: "paragraph",
        text: "9.1 We use traffic log cookies to identify which pages are being used. This helps us analyse data about web page traffic and improve our services in order to tailor them to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.",
      },
      {
        kind: "paragraph",
        text: "9.2 Overall, cookies help us provide you with a better experience, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.",
      },
      {
        kind: "paragraph",
        text: "9.3 You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of our services.",
      },
      {
        kind: "paragraph",
        text: "9.4 We may use Google Analytics to analyse the use of our website. Google Analytics gathers information about website use by means of cookies. The information gathered relating to our website is used to create reports about the use of our website. Google's privacy policy can be found at the following web address: https://www.google.com/policies/privacy/.",
      },
      { kind: "heading", text: "10. Our details" },
      {
        kind: "paragraph",
        text: "10.1 This website is owned and operated by RA Developments (NW) Limited.",
      },
      {
        kind: "paragraph",
        text: "10.2 Our registered office address is Peel House, 30 The Downs, Altrincham, Cheshire, WA14 2PX and our company registration number is 13192451.",
      },
      {
        kind: "paragraph",
        text: "10.3 You can contact us: (a) by post, to the postal address given above; or (b) by email, to noreply.ai@satisgroup.co.uk.",
      },
    ],
  },
  {
    slug: "modern-slavery",
    title: "Modern Slavery Statement",
    shortTitle: "Modern Slavery Statement",
    intro:
      "This statement applies to all companies within and associated to RA Developments (NW) Limited (trading as SATIS Group) (referred to in this statement as ‘The Company’). The information included in the statement refers to the financial year 2020.",
    blocks: [
      { kind: "heading", text: "Organisational Structure" },
      {
        kind: "paragraph",
        text: "SATIS Group and its group of companies operate a property development business. The business operates from one office from which all employees work. SATIS Group acts as a parent company to many subsidiaries and is controlled by its two directors and co-founders, Shiro Rauniar and Thomas Morley. The directors welcome the Modern Slavery Act as an important piece of legislation that will not only help achieve greater transparency in supply chains, but which will also protect those who are vulnerable. SATIS Group operates from one office located in Hale, Cheshire, United Kingdom. The Company covers various areas of business including consulting, operations, project management, development, procurement, financing, marketing, sales and lettings. Business is conducted throughout the year and is not dependent on seasons.",
      },
      {
        kind: "paragraph",
        text: "The labour supplied to SATIS Group in pursuance of its operation is carried out in the United Kingdom, specifically the North West of England.",
      },
      { kind: "heading", text: "Definitions" },
      {
        kind: "paragraph",
        text: "SATIS Group considers that modern slavery encompasses:",
      },
      {
        kind: "list",
        items: [
          "Human trafficking;",
          "Forced work, through mental or physical threat;",
          "Being owned or controlled by an employer through mental or physical abuse or the threat of abuse;",
          "Being dehumanised, treated as a commodity or being bought or sold as property;",
          "Being physically constrained or to have restriction placed on freedom of movement.",
        ],
      },
      { kind: "heading", text: "Commitment" },
      {
        kind: "paragraph",
        text: "The Company acknowledges its responsibilities in relation to tackling modern slavery and commits to complying with the provisions in the Modern Slavery Act 2015. SATIS Group understands that this requires an ongoing review of both its internal practices in relation to its labour force and, additionally, its supply chains.",
      },
      {
        kind: "paragraph",
        text: "SATIS Group does not enter into business with any other organisation, in the United Kingdom or abroad, which knowingly supports or is found to involve itself in slavery, servitude and forced or compulsory labour.",
      },
      {
        kind: "paragraph",
        text: "No labour provided to The Company in the pursuance of the provision of its own services is obtained by means of slavery or human trafficking. The Company strictly adheres to the minimum standards required in relation to its responsibilities under relevant employment legislation in the United Kingdom.",
      },
      { kind: "heading", text: "Supply Chains" },
      {
        kind: "paragraph",
        text: "In order to fulfil its activities, SATIS Group's main supply chains include those related to the engagement of subcontractors and subconsultants to undertake services and works on our construction sites including sourcing materials and manufactured products. We take an active role in development of our suppliers and use a variety of methods to clearly convey our requirements. We have strong relationships with our subcontractors, subconsultants and suppliers and outline our expectations of ethical business conduct. Anyone, including workers, subcontractors, subconsultants, and vendors, is encouraged to disclose any complaints or concerns regarding alleged or possible ethics, human rights, legal, or regulatory violations, including illegal or immoral business practices, in good faith. In accordance with the Modern Slavery Act 2015, we expect our supply chain to have appropriate anti-slavery and human trafficking policies and processes. Our expectation is that each organisation in the supply chain conducts due diligence on the next link in the chain and assumes responsibility for ensuring compliance. It is not viable for SATIS Group (or any other individual in the chain) to have direct contact with all supply chain connections.",
      },
      { kind: "heading", text: "Potential Exposure" },
      {
        kind: "paragraph",
        text: "The Company considers its main exposure to the risk of slavery and human trafficking to exist in its construction sector, specifically subcontractor supply chains because they involve the provisions of a manual labour workforce.",
      },
      {
        kind: "paragraph",
        text: "In general, SATIS Group considers its exposure to slavery/human trafficking to be negligible. Nonetheless, we have taken steps to ensure that such practices do not take place in our business nor the business of any organisation that supplies goods and/or services to us.",
      },
      { kind: "heading", text: "Impact of COVID-19" },
      {
        kind: "paragraph",
        text: "During the reporting period covered by this statement, the COVID-19 pandemic had taken hold. For several months, the UK was placed into lockdown to stem the spread of COVID-19. This created several challenges for The Company, as it did for others across the nation.",
      },
      {
        kind: "paragraph",
        text: "The Company welcomes the UK Government’s decision, as confirmed in April 2020, to allow for a delay of up to 6 months in the publication of modern slavery statements without the risk of facing penalty. Despite the permitted delay, The Company remains in a position to publish its statement in line with the original publishing requirements.",
      },
      {
        kind: "paragraph",
        text: "The Company concludes that the COVID-19 pandemic did not adjust the risk of modern slavery to a level above that which existed before the pandemic, which is as set out under ‘Potential Exposure’ above. Accordingly, The Company’s use of suppliers dropped due to the fact that homeworking was swiftly implemented in March 2020 which meant that its premises, from which it usually conducts day to day business, were temporarily closed.",
      },
      {
        kind: "paragraph",
        text: "During the pandemic, the Group’s employees still had access to the grievance procedure to raise any concerns that they may have had. In line with emergency legislation passed by the Government, Group employees have been paid Statutory Sick Pay during periods of self-isolation where it has not been possible to agree a temporary period of homeworking.",
      },
      { kind: "heading", text: "Steps" },
      {
        kind: "paragraph",
        text: "The Company has not, to its knowledge, conducted any business with another organisation which has been found to have involved itself with modern slavery.",
      },
      {
        kind: "paragraph",
        text: "In accordance with section 54(4) of the Modern Slavery Act 2015, The Company has taken the following steps to ensure that modern slavery is not taking place:",
      },
      {
        kind: "list",
        items: [
          "Measures in place to identify and assess the potential risks in its supply chains;",
          "Action plans to address risk to modern slavery;",
        ],
      },
      { kind: "heading", text: "Policies" },
      {
        kind: "paragraph",
        text: "The Company is committed to acting ethically and with honesty in all of our business relationships, as well as implementing and enforcing effective processes and controls to ensure that slavery and human trafficking do not occur anywhere in the company or our supply chain, to the extent possible. We follow all legislation, to ensure that no one works illegally.",
      },
      {
        kind: "paragraph",
        text: "This statement is made in pursuance of Section 54(1) of the Modern Slavery Act 2015 and will be reviewed for each financial year.",
      },
      { kind: "paragraph", text: "Thomas Morley, Director" },
    ],
  },
];

export function getLegalPage(slug: string): LegalPage | undefined {
  return LEGAL_PAGES.find((page) => page.slug === slug);
}
