import pool from "../config/db.js";

async function insertStaticPages() {
  try {
    //FAQ
    await pool.query(`
            INSERT INTO faqs
            (
            category,
            question,
            answer,
            display_order,
            is_active
            )
            VALUES
            (
            'General',
            'Can I use Dummy FAQs for my website or project?',
            'Yes, you can use Dummy FAQs to populate your website or project during development or testing phases.They help simulate the appearanceand functionality of a real FAQ sectionwithout requiring actual content.',
            1,
            TRUE
            ),

            (
            'General',
            'Are Dummy FAQs suitable for customer support purposes?',
            'Dummy FAQs are intended for testing and demonstartion purposes only.Replace Them with real support content before deployment.',
            2,
            TRUE
            ),

            (
            'General',
            'Do Dummy FAQs require attribution?',
            'No. You may modify or replace the Dummy FAQ content according to your project requirement.',
            3,
            TRUE
            ),

            (
            'Payments',
            'Can I test my website/app with Dummy Payments?',
            'Yes. Dummy Payments are commonly used by developers and businesses to test the functionality of e-commerce platforms, mobile apps, and payment gateways without risking real transactions.',
            1,
            TRUE
            ),

            (
            'Payments',
            'Are Dummy Payments secure?',
            'Yes. Dummy payments are simulated transactions and do not process real money or sensitive financial information.',
            2,
            TRUE
            ),

            (
            'Refunds',
            'How do I request a refund?',
            'To request a refund, simply contact our customer support team through email or phone and provide details about your purchase and reason for the refund. Our representatives will guide you through the process.',
            1,
            TRUE
            ),

            (
            'Refunds',
            'What is the refund policy?',
            'Refund requests are reviewed according to our refund policy and eligibility requirements.',
            2,
            TRUE
            ),

            (
            'Refunds',
            'How long does it take to process a refund?',
            'Approved refunds are generally processed within 5 to 7 business days.',
            3,
            TRUE
            ),

            (
            'Support',
            'How do I contact customer support?',
            'You can contact our customer support team via email, phone, or live chat. Our representatives are available to assist you during business hours, Monday through Friday.',
            1,
            TRUE
            ),

            (
            'Support',
            'Is customer support available 24/7?',
            'Customer support availability depends on your subscription plan and support channel.',
            2,
            TRUE
            ),

            (
            'Support',
            'How long does it take to receive a response from customer support?',
            'Most customer support requests receive a response within one business day.',
            3,
            TRUE
            );
       `);
    console.log("FAQs inserted successfully");

    //help_center
    await pool.query(`
            INSERT INTO help_center
            (
            category, 
            title, 
            description, 
            author_name, 
            video_count
            )
            VALUES
            (
            'Getting Started',
            'Getting Started with Larkon',
            'Welcome to Larkon. Dive into basic onboarding experience.',
            'Aston Martin',
            19
            ),
            
            (
            'Administration',
            'Admin Settings',
            'Learn how to manage your current workspace or your enterprise space.',
            'Michael A. Miner',
            10
            ),

            (
            'Server',
            'Server Setup',
            'Connect, simplify, and automate. Discover the power of apps and tools.',
            'Theresa T. Brose',
            7
            ),
            
            (
            'Authentication',
            'Login And Verification',
            'Read on to learn how to sign in with your email address or Apple or Google account.',
            'James L. Erickson',
            3
            ),

            (
            'Account',
            'Account Setup',
            'Adjust your setup and preferences to make the application work just for you.',
            'Lily Wilson',
            11
            ),

            (
            'Security',
            'Trust & Safety',
            'Learn how to manage your database securely and distribute your data safely.',
            'Sarah Brooks',
            9
            ),

            (
            'Communication',
            'Channel Setup',
            'From channels to search, learn how the communication system works from top to bottom.',
            'Joe K. Hall',
            14
            ),

            (
            'Permissions',
            'Permissions',
            'Manage permissions for yourself and others to join and work within a workspace.',
            'Robert Leavitt',
            17
            ),

            (
            'Billing',
            'Billing Help',
            'Learn how to review your bank account information, billing, and invoices.',
            'Lydia Anderson',
            12
            );
            
        `);
        console.log("Help Center data inserted successfully.");

    // Privacy Policy Data
    await pool.query(`
        INSERT INTO privacy_policy 
        (
        title, 
        description
        )
        VALUES
        (
        'Introduction',
        'TechFusion Solutions Inc. ("we", "our", "us") respects your privacy and is committed to protecting it through our compliance with this policy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our SaaS product, TechFusion Suite, available through our website and applications. Please read this policy carefully to understand our practices regarding your information.'
        ),
        
        (
        'Information We Collect',
        'We may collect personal information such as your name, email address, phone number, billing information, and account details. We also collect technical information including IP address, browser type, device information, and usage analytics to improve our services.'
        ),
        
        (
        'Our Role in Your Privacy',
        'We are committed to maintaining the confidentiality, integrity, and security of your personal information. We implement industry-standard security measures to protect your data and ensure it is processed in accordance with applicable privacy laws and regulations.'
        ),
        
        (
        'How We Use Your Information',
        'Your information is used to provide and maintain our services, process transactions, improve user experience, communicate important updates, provide customer support, and comply with legal obligations.'
        ),
        
        (
        'Sharing of Information',
        'We do not sell your personal information. We may share your data with trusted third-party service providers who assist in operating our platform, processing payments, or complying with legal requirements, subject to strict confidentiality obligations.'
        ),
        
        (
        'Data Security',
        'We employ administrative, technical, and physical safeguards to protect your personal information against unauthorized access, disclosure, alteration, or destruction. Despite these measures, no method of electronic transmission or storage is completely secure.'
        ),
        
        (
        'Your Rights',
        'Depending on your location, you may have the right to access, update, correct, or delete your personal information. You may also request a copy of your stored data or object to certain processing activities where permitted by law.'
        ),
        
        (
        'Changes to This Privacy Policy',
        'We may update this Privacy Policy from time to time to reflect changes in our services or legal requirements. Any updates will be posted on this page with the revised effective date.'
        );
    `);
    console.log("Privacy Policy data inserted successfully.");
    
} catch (error) {
    console.error("Error inserting Static Pages:", error);
} finally {
    process.exit();
  }
}

insertStaticPages();
