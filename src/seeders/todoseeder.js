import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export async function seed() {

try {

    console.log("Seeding Todo Database...");

    const hashedPassword = await bcrypt.hash("123456", 10);

        // ==========================
        // USERS
        // ==========================
await pool.query(`
INSERT INTO users
(
    first_name,
    last_name,
    full_name,
    username,
    email,
    password,
    profile_image,
    phone,
    status
)
VALUES
('John','Smith','John Smith','johnsmith','john@lavitra.com',$1,'john-smith.jpg','9876543210','Active'),
('Sarah','Johnson','Sarah Johnson','sarahjohnson','sarah@lavitra.com',$1,'sarah-johnson.jpg','9876543211','Active'),
('Mike','Brown','Mike Brown','mikebrown','mike@lavitra.com',$1,'mike-brown.jpg','9876543212','Active'),
('Emily','Davis','Emily Davis','emilydavis','emily@lavitra.com',$1,'emily-davis.jpg','9876543213','Active'),
('David','Wilson','David Wilson','davidwilson','david@lavitra.com',$1,'david-wilson.jpg','9876543214','Active'),
('Chris','Lee','Chris Lee','chrislee','chris@lavitra.com',$1,'chris-lee.jpg','9876543215','Active'),
('Jessica','Taylor','Jessica Taylor','jessicataylor','jessica@lavitra.com',$1,'jessica-taylor.jpg','9876543216','Active'),
('Daniel','Martinez','Daniel Martinez','danielmartinez','daniel@lavitra.com',$1,'daniel-martinez.jpg','9876543217','Active'),
('Anna','White','Anna White','annawhite','anna@lavitra.com',$1,'anna-white.jpg','9876543218','Active'),
('Tom','Anderson','Tom Anderson','tomanderson','tom@lavitra.com',$1,'tom-anderson.jpg','9876543219','Active'),
('Mekala','Venkata Lingaiah','Mekala Venkata Lingaiah','mekalavenkata','venkat@lavitra.com',$1,'venkat.jpg','9876543220','Active')

ON CONFLICT (username) DO NOTHING;
`, [hashedPassword]);

        
// ==========================
           // PROJECTS
// ==========================

await pool.query(`
INSERT INTO projects
(
    project_name,
    description,
    start_date,
    end_date,
    status,
    created_by
)
SELECT *
FROM (
    VALUES

    (
        'Web Dashboard',
        'Admin Dashboard Development',
        DATE '2026-08-01',
        DATE '2026-08-30',
        'Active',
        1
    ),

    (
        'Mobile Application',
        'Android Application',
        DATE '2026-08-02',
        DATE '2026-08-31',
        'Active',
        1
    ),

    (
        'Internal Project',
        'Internal Company Project',
        DATE '2026-08-01',
        DATE '2026-09-05',
        'Active',
        1
    ),

    (
        'Marketing Website',
        'Company Website',
        DATE '2026-08-01',
        DATE '2026-08-25',
        'Active',
        1
    ),

    (
        'Backend System',
        'REST API Development',
        DATE '2026-08-01',
        DATE '2026-08-28',
        'Active',
        1
    ),

    (
        'DevOps',
        'CI/CD Pipeline',
        DATE '2026-08-01',
        DATE '2026-08-29',
        'Active',
        1
    ),

    (
        'Team Chat',
        'Realtime Chat Application',
        DATE '2026-08-01',
        DATE '2026-08-31',
        'Active',
        1
    ),

    (
        'Authentication',
        'JWT Authentication Module',
        DATE '2026-08-01',
        DATE '2026-08-18',
        'Active',
        1
    ),

    (
        'User Management',
        'User Roles and Permissions',
        DATE '2026-08-01',
        DATE '2026-08-22',
        'Active',
        1
    ),

    (
        'Documentation',
        'Swagger API Documentation',
        DATE '2026-08-01',
        DATE '2026-08-20',
        'Active',
        1
    )

) AS new_projects(
    project_name,
    description,
    start_date,
    end_date,
    status,
    created_by
)
WHERE NOT EXISTS (
    SELECT 1
    FROM projects p
    WHERE p.project_name = new_projects.project_name
);
`);

console.log("Projects Seeded Safely");
    
        
    // ==========================
         // TASK STATUS
     // ==========================

await pool.query(`
    INSERT INTO task_status (status_name)
    SELECT new_status.status_name
    FROM (
        VALUES
            ('To Do'),
            ('In Progress'),
            ('Done'),
            ('Pending')
    ) AS new_status(status_name)
    WHERE NOT EXISTS (
        SELECT 1
        FROM task_status ts
        WHERE ts.status_name = new_status.status_name
    );
`);

console.log("Task Status Seeded Safely");

        // ==========================
               // TASK PRIORITY
        // ==========================
    await pool.query(`
    INSERT INTO task_priority (priority_name)
    SELECT new_priority.priority_name
    FROM (
        VALUES
            ('High'),
            ('Medium'),
            ('Low')
    ) AS new_priority(priority_name)
    WHERE NOT EXISTS (
        SELECT 1
        FROM task_priority tp
        WHERE tp.priority_name = new_priority.priority_name
    );
`);

console.log("Task Priority Seeded Safely");

        // ==========================
               // TASK PROGRESS
        // ========================
await pool.query(`
    INSERT INTO task_progress (progress_percentage)
    SELECT new_progress.progress_percentage
    FROM (
        VALUES
            (0),
            (10),
            (20),
            (30),
            (40),
            (50),
            (60),
            (70),
            (80),
            (90),
            (100)
    ) AS new_progress(progress_percentage)
    WHERE NOT EXISTS (
        SELECT 1
        FROM task_progress tp
        WHERE tp.progress_percentage = new_progress.progress_percentage
    );
`);

console.log("Task Progress Seeded Safely");
        

// ==========================
          // TASKS
// ==========================
await pool.query(`
INSERT INTO tasks
(
    project_id,
    task_name,
    description,
    due_date,
    priority_id,
    status_id,
    progress_id,
    created_by
)
VALUES

(1, 'Design New Dashboard UI',
 'Create responsive dashboard UI',
 DATE '2026-08-08',
 1, 2, 7, 1),

(2, 'Develop REST API for Mobile App',
 'Develop secure REST APIs',
 DATE '2026-08-10',
 2, 1, 1, 1),

(1, 'Fix Login Issues on Production',
 'Resolve authentication bugs',
 DATE '2026-08-07',
 1, 3, 11, 1),

(3, 'Prepare Project Documentation',
 'Prepare technical documents',
 DATE '2026-08-12',
 3, 2, 5, 1),

(4, 'Update Landing Page Content',
 'Update website content',
 DATE '2026-08-11',
 2, 1, 3, 1),

(5, 'Optimize Database Queries',
 'Improve SQL query performance',
 DATE '2026-08-09',
 1, 3, 11, 1),

(1, 'Conduct UI/UX Review',
 'Review application UI',
 DATE '2026-08-13',
 2, 2, 8, 1),

(6, 'Setup CI/CD Pipeline',
 'Configure GitHub Actions',
 DATE '2026-08-14',
 1, 1, 2, 1),

(2, 'Review Code & Merge',
 'Review pull requests',
 DATE '2026-08-15',
 3, 2, 4, 1),

(3, 'Research New Features',
 'Research upcoming features',
 DATE '2026-08-16',
 3, 3, 11, 1),

(7, 'Team Chat Database Setup',
 'Create Team Chat Database',
 DATE '2026-08-06',
 1, 3, 11, 1),

(5, 'Todo App Database Integration',
 'Integrate Todo Database',
 DATE '2026-08-06',
 1, 3, 11, 1),

(7, 'Implement Chat APIs',
 'Develop Team Chat APIs',
 DATE '2026-08-09',
 1, 2, 7, 1),

(8, 'Create Authentication Module',
 'Implement JWT Authentication',
 DATE '2026-08-10',
 1, 4, 1, 1),

(10, 'API Documentation (Swagger)',
 'Prepare Swagger Documentation',
 DATE '2026-08-13',
 2, 1, 1, 1);
`);

console.log("15 Tasks Inserted Successfully");

// ==========================
         // TASK ASSIGNEES
// ==========================
await pool.query(`
    INSERT INTO task_assignees
    (
        task_id,
        user_id
    )
    SELECT
        t.id,
        v.user_id
    FROM (
        VALUES
            ('Design New Dashboard UI', 1),
            ('Develop REST API for Mobile App', 2),
            ('Fix Login Issues on Production', 3),
            ('Prepare Project Documentation', 4),
            ('Update Landing Page Content', 5),
            ('Optimize Database Queries', 6),
            ('Conduct UI/UX Review', 7),
            ('Setup CI/CD Pipeline', 8),
            ('Review Code & Merge', 9),
            ('Research New Features', 10),
            ('Team Chat Database Setup', 11),
            ('Todo App Database Integration', 11),
            ('Implement Chat APIs', 11),
            ('Create Authentication Module', 11),
            ('API Documentation (Swagger)', 11)
    ) AS v(task_name, user_id)

    INNER JOIN tasks t
        ON t.task_name = v.task_name

    WHERE NOT EXISTS (
        SELECT 1
        FROM task_assignees ta
        WHERE ta.task_id = t.id
        AND ta.user_id = v.user_id
    );
`);

console.log("Task Assignees Seeded Safely");

// ==========================
      // TASK COMMENTS
// ==========================

await pool.query(`
    INSERT INTO task_comments
    (
        task_id,
        user_id,
        comment
    )
    SELECT
        t.id,
        v.user_id,
        v.comment
    FROM (
        VALUES
            (
                'Design New Dashboard UI',
                1,
                'Dashboard UI is 60% completed.'
            ),
            (
                'Develop REST API for Mobile App',
                2,
                'API endpoints are under development.'
            ),
            (
                'Fix Login Issues on Production',
                3,
                'Login issue has been fixed successfully.'
            ),
            (
                'Prepare Project Documentation',
                4,
                'Documentation draft uploaded.'
            ),
            (
                'Update Landing Page Content',
                5,
                'Landing page content needs review.'
            ),
            (
                'Optimize Database Queries',
                6,
                'Database queries optimized successfully.'
            ),
            (
                'Conduct UI/UX Review',
                7,
                'UI review meeting completed.'
            ),
            (
                'Setup CI/CD Pipeline',
                8,
                'CI/CD pipeline configuration started.'
            ),
            (
                'Review Code & Merge',
                9,
                'Code review in progress.'
            ),
            (
                'Research New Features',
                10,
                'Feature research completed.'
            ),
            (
                'Team Chat Database Setup',
                11,
                'Team Chat database completed.'
            ),
            (
                'Todo App Database Integration',
                11,
                'Todo database integrated successfully.'
            ),
            (
                'Implement Chat APIs',
                11,
                'Chat APIs development is in progress.'
            ),
            (
                'Create Authentication Module',
                11,
                'Authentication module pending.'
            ),
            (
                'API Documentation (Swagger)',
                11,
                'Swagger documentation will be completed today.'
            )
    ) AS v(task_name, user_id, comment)

    INNER JOIN tasks t
        ON t.task_name = v.task_name

    WHERE NOT EXISTS (
        SELECT 1
        FROM task_comments tc
        WHERE tc.task_id = t.id
        AND tc.user_id = v.user_id
        AND tc.comment = v.comment
    );
`);

console.log("Task Comments Seeded Safely");

// ==========================
// TASK LABELS
// =======================
await pool.query(`
    INSERT INTO task_labels
    (
        task_id,
        label_name,
        label_color
    )
    SELECT
        t.id,
        v.label_name,
        v.label_color
    FROM (
        VALUES
            ('Design New Dashboard UI', 'UI', '#2196F3'),
            ('Develop REST API for Mobile App', 'API', '#4CAF50'),
            ('Fix Login Issues on Production', 'Bug', '#F44336'),
            ('Prepare Project Documentation', 'Documentation', '#9C27B0'),
            ('Update Landing Page Content', 'Content', '#FF9800'),
            ('Optimize Database Queries', 'Database', '#3F51B5'),
            ('Conduct UI/UX Review', 'Review', '#00BCD4'),
            ('Setup CI/CD Pipeline', 'DevOps', '#795548'),
            ('Review Code & Merge', 'Code Review', '#607D8B'),
            ('Research New Features', 'Research', '#8BC34A'),
            ('Team Chat Database Setup', 'Team Chat', '#673AB7'),
            ('Todo App Database Integration', 'Todo App', '#009688'),
            ('Implement Chat APIs', 'Backend', '#3F51B5'),
            ('Create Authentication Module', 'Authentication', '#E91E63'),
            ('API Documentation (Swagger)', 'Swagger', '#FFC107')
    ) AS v(task_name, label_name, label_color)

    INNER JOIN tasks t
        ON t.task_name = v.task_name

    WHERE NOT EXISTS (
        SELECT 1
        FROM task_labels tl
        WHERE tl.task_id = t.id
        AND tl.label_name = v.label_name
    );
`);

console.log("Task Labels Seeded Safely");

// ==========================
// TASK NOTIFICATIONS
// ==========================

await pool.query(`
    INSERT INTO task_notifications
    (
        user_id,
        task_id,
        title,
        message,
        is_read
    )
    SELECT
        new_notification.user_id,
        t.id,
        new_notification.title,
        new_notification.message,
        new_notification.is_read
    FROM (
        VALUES
        (1, 'Design New Dashboard UI',
         'New Task Assigned',
         'Design New Dashboard UI has been assigned to you.', false),

        (2, 'Develop REST API for Mobile App',
         'New Task Assigned',
         'Develop REST API for Mobile App has been assigned to you.', false),

        (3, 'Fix Login Issues on Production',
         'Task Completed',
         'Fix Login Issues on Production has been completed.', true),

        (4, 'Prepare Project Documentation',
         'Task Updated',
         'Project Documentation task has been updated.', false),

        (5, 'Update Landing Page Content',
         'Task Reminder',
         'Landing Page Content deadline is tomorrow.', false),

        (6, 'Optimize Database Queries',
         'Task Completed',
         'Optimize Database Queries completed successfully.', true),

        (7, 'Conduct UI/UX Review',
         'Review Assigned',
         'Please complete UI/UX Review.', false),

        (8, 'Setup CI/CD Pipeline',
         'Pipeline Update',
         'CI/CD Pipeline task is pending.', false),

        (9, 'Review Code & Merge',
         'Code Review',
         'Review Code & Merge is in progress.', false),

        (10, 'Research New Features',
         'Research Completed',
         'Research New Features completed.', true),

        (11, 'Team Chat Database Setup',
         'Database Ready',
         'Team Chat Database Setup completed.', true),

        (11, 'Todo App Database Integration',
         'Database Ready',
         'Todo App Database Integration completed.', true),

        (11, 'Implement Chat APIs',
         'API Progress',
         'Implement Chat APIs is 60% completed.', false),

        (11, 'Create Authentication Module',
         'Authentication',
         'Authentication Module is pending.', false),

        (11, 'API Documentation (Swagger)',
         'Swagger',
         'Complete Swagger Documentation before deadline.', false)

    ) AS new_notification(
        user_id,
        task_name,
        title,
        message,
        is_read
    )

    INNER JOIN tasks t
        ON t.task_name = new_notification.task_name

    WHERE NOT EXISTS (
        SELECT 1
        FROM task_notifications tn
        WHERE tn.user_id = new_notification.user_id
        AND tn.task_id = t.id
        AND tn.title = new_notification.title
        AND tn.message = new_notification.message
    );
`);

console.log("Task Notifications Seeded Safely");

// ==========================
     // TASK ACTIVITY LOGS
// ==========================

await pool.query(`
    INSERT INTO task_activity_logs
    (
        task_id,
        activity,
        user_id
    )
    SELECT
        t.id,
        v.activity,
        v.user_id
    FROM (
        VALUES
            ('Design New Dashboard UI',
             'Task Created', 1),

            ('Develop REST API for Mobile App',
             'Task Assigned', 2),

            ('Fix Login Issues on Production',
             'Status Changed to Done', 3),

            ('Prepare Project Documentation',
             'Documentation Updated', 4),

            ('Update Landing Page Content',
             'Content Updated', 5),

            ('Optimize Database Queries',
             'Database Optimized', 6),

            ('Conduct UI/UX Review',
             'UI Review Completed', 7),

            ('Setup CI/CD Pipeline',
             'Pipeline Created', 8),

            ('Review Code & Merge',
             'Code Reviewed', 9),

            ('Research New Features',
             'Research Completed', 10),

            ('Team Chat Database Setup',
             'Database Setup Completed', 11),

            ('Todo App Database Integration',
             'Database Integrated', 11),

            ('Implement Chat APIs',
             'API Development Started', 11),

            ('Create Authentication Module',
             'Authentication Pending', 11),

            ('API Documentation (Swagger)',
             'Swagger Documentation Started', 11)

    ) AS v(task_name, activity, user_id)

    INNER JOIN tasks t
        ON t.task_name = v.task_name

    WHERE NOT EXISTS (
        SELECT 1
        FROM task_activity_logs tal
        WHERE tal.task_id = t.id
        AND tal.activity = v.activity
        AND tal.user_id = v.user_id
    );
`);

console.log("Task Activity Logs Seeded Safely");

// ==========================
// TASK HISTORY
// ========================

await pool.query(`
    INSERT INTO task_history
    (
        task_id,
        action,
        old_value,
        new_value,
        changed_by
    )
    SELECT
        t.id,
        v.action,
        v.old_value,
        v.new_value,
        v.changed_by
    FROM (
        VALUES
            (
                'Design New Dashboard UI',
                'Task Created',
                '-',
                'Design New Dashboard UI',
                1
            ),
            (
                'Develop REST API for Mobile App',
                'Status Updated',
                'To Do',
                'In Progress',
                2
            ),
            (
                'Fix Login Issues on Production',
                'Status Updated',
                'In Progress',
                'Done',
                3
            ),
            (
                'Prepare Project Documentation',
                'Description Updated',
                'Old Documentation',
                'New Documentation',
                4
            ),
            (
                'Update Landing Page Content',
                'Priority Updated',
                'Low',
                'Medium',
                5
            ),
            (
                'Optimize Database Queries',
                'Progress Updated',
                '60',
                '100',
                6
            ),
            (
                'Conduct UI/UX Review',
                'Status Updated',
                'To Do',
                'In Progress',
                7
            ),
            (
                'Setup CI/CD Pipeline',
                'Task Assigned',
                'Unassigned',
                'Daniel Martinez',
                8
            ),
            (
                'Review Code & Merge',
                'Progress Updated',
                '20',
                '30',
                9
            ),
            (
                'Research New Features',
                'Task Completed',
                'In Progress',
                'Done',
                10
            ),
            (
                'Team Chat Database Setup',
                'Database Created',
                'Pending',
                'Completed',
                11
            ),
            (
                'Todo App Database Integration',
                'Integration Updated',
                'Pending',
                'Completed',
                11
            ),
            (
                'Implement Chat APIs',
                'Progress Updated',
                '40',
                '60',
                11
            ),
            (
                'Create Authentication Module',
                'Authentication Started',
                'Pending',
                'In Progress',
                11
            ),
            (
                'API Documentation (Swagger)',
                'Swagger Documentation Updated',
                'Pending',
                'Started',
                11
            )

    ) AS v(
        task_name,
        action,
        old_value,
        new_value,
        changed_by
    )

    INNER JOIN tasks t
        ON t.task_name = v.task_name

    WHERE NOT EXISTS (
        SELECT 1
        FROM task_history th
        WHERE th.task_id = t.id
        AND th.action = v.action
        AND th.changed_by = v.changed_by
    );
`);

console.log("Task History Seeded Safely");

//==========================
// TASK ATTACHMENTS
// ==========================

await pool.query(`
    INSERT INTO task_attachments
    (
        task_id,
        file_name,
        file_path,
        file_size
    )
    SELECT
        t.id,
        v.file_name,
        v.file_path,
        v.file_size
    FROM (
        VALUES
            (
                'Design New Dashboard UI',
                'dashboard-ui.png',
                '/uploads/dashboard-ui.png',
                '2.1 MB'
            ),
            (
                'Develop REST API for Mobile App',
                'mobile-api.pdf',
                '/uploads/mobile-api.pdf',
                '1.4 MB'
            ),
            (
                'Fix Login Issues on Production',
                'login-fix.docx',
                '/uploads/login-fix.docx',
                '450 KB'
            ),
            (
                'Prepare Project Documentation',
                'documentation.pdf',
                '/uploads/documentation.pdf',
                '1.2 MB'
            ),
            (
                'Update Landing Page Content',
                'landing-page.zip',
                '/uploads/landing-page.zip',
                '3.0 MB'
            ),
            (
                'Optimize Database Queries',
                'database.sql',
                '/uploads/database.sql',
                '800 KB'
            ),
            (
                'Conduct UI/UX Review',
                'ui-review.pdf',
                '/uploads/ui-review.pdf',
                '950 KB'
            ),
            (
                'Setup CI/CD Pipeline',
                'pipeline.yml',
                '/uploads/pipeline.yml',
                '120 KB'
            ),
            (
                'Review Code & Merge',
                'code-review.docx',
                '/uploads/code-review.docx',
                '350 KB'
            ),
            (
                'Research New Features',
                'research.pdf',
                '/uploads/research.pdf',
                '2.4 MB'
            ),
            (
                'Team Chat Database Setup',
                'team-chat-db.sql',
                '/uploads/team-chat-db.sql',
                '600 KB'
            ),
            (
                'Todo App Database Integration',
                'todo-db.sql',
                '/uploads/todo-db.sql',
                '700 KB'
            ),
            (
                'Implement Chat APIs',
                'chat-api.docx',
                '/uploads/chat-api.docx',
                '500 KB'
            ),
            (
                'Create Authentication Module',
                'auth-module.pdf',
                '/uploads/auth-module.pdf',
                '850 KB'
            ),
            (
                'API Documentation (Swagger)',
                'swagger.json',
                '/uploads/swagger.json',
                '300 KB'
            )

    ) AS v(
        task_name,
        file_name,
        file_path,
        file_size
    )

    INNER JOIN tasks t
        ON t.task_name = v.task_name

    WHERE NOT EXISTS (
        SELECT 1
        FROM task_attachments ta
        WHERE ta.task_id = t.id
        AND ta.file_name = v.file_name
    );
`);

console.log("Task Attachments Seeded Safely");

// ==========================
// TASK CHECKLISTS
// ========================

await pool.query(`
    INSERT INTO task_checklists
    (
        task_id,
        checklist_item,
        is_completed
    )
    SELECT
        t.id,
        v.checklist_item,
        v.is_completed
    FROM (
        VALUES
            (
                'Design New Dashboard UI',
                'Create UI Layout',
                true
            ),
            (
                'Develop REST API for Mobile App',
                'Create API Routes',
                false
            ),
            (
                'Fix Login Issues on Production',
                'Fix Authentication Bug',
                true
            ),
            (
                'Prepare Project Documentation',
                'Write Documentation',
                false
            ),
            (
                'Update Landing Page Content',
                'Update Website Content',
                false
            ),
            (
                'Optimize Database Queries',
                'Optimize Queries',
                true
            ),
            (
                'Conduct UI/UX Review',
                'Review UI',
                true
            ),
            (
                'Setup CI/CD Pipeline',
                'Setup GitHub Actions',
                false
            ),
            (
                'Review Code & Merge',
                'Merge Pull Request',
                false
            ),
            (
                'Research New Features',
                'Research AI Features',
                true
            ),
            (
                'Team Chat Database Setup',
                'Create Database Tables',
                true
            ),
            (
                'Todo App Database Integration',
                'Connect Todo Database',
                true
            ),
            (
                'Implement Chat APIs',
                'Implement Chat Endpoints',
                false
            ),
            (
                'Create Authentication Module',
                'Generate JWT Token',
                false
            ),
            (
                'API Documentation (Swagger)',
                'Create Swagger Docs',
                false
            )

    ) AS v(
        task_name,
        checklist_item,
        is_completed
    )

    INNER JOIN tasks t
        ON t.task_name = v.task_name

    WHERE NOT EXISTS (
        SELECT 1
        FROM task_checklists tc
        WHERE tc.task_id = t.id
        AND tc.checklist_item = v.checklist_item
    );
`);

console.log("Task Checklists Seeded Safely");

// ==========================
// TASK REMINDERS
// ==========================

await pool.query(`
    INSERT INTO task_reminders
    (
        task_id,
        reminder_date,
        reminder_type
    )
    SELECT
        t.id,
        v.reminder_date::timestamp,
        v.reminder_type
    FROM (
        VALUES
            (
                'Design New Dashboard UI',
                '2026-08-07 09:00:00',
                'Email'
            ),
            (
                'Develop REST API for Mobile App',
                '2026-08-09 10:00:00',
                'Notification'
            ),
            (
                'Fix Login Issues on Production',
                '2026-08-06 09:00:00',
                'Email'
            ),
            (
                'Prepare Project Documentation',
                '2026-08-11 11:00:00',
                'Notification'
            ),
            (
                'Update Landing Page Content',
                '2026-08-10 09:30:00',
                'Email'
            ),
            (
                'Optimize Database Queries',
                '2026-08-08 10:30:00',
                'Notification'
            ),
            (
                'Conduct UI/UX Review',
                '2026-08-12 09:00:00',
                'Email'
            ),
            (
                'Setup CI/CD Pipeline',
                '2026-08-13 10:00:00',
                'Notification'
            ),
            (
                'Review Code & Merge',
                '2026-08-14 11:00:00',
                'Email'
            ),
            (
                'Research New Features',
                '2026-08-15 09:00:00',
                'Notification'
            ),
            (
                'Team Chat Database Setup',
                '2026-08-05 09:00:00',
                'Email'
            ),
            (
                'Todo App Database Integration',
                '2026-08-05 10:00:00',
                'Notification'
            ),
            (
                'Implement Chat APIs',
                '2026-08-08 09:00:00',
                'Email'
            ),
            (
                'Create Authentication Module',
                '2026-08-09 09:30:00',
                'Notification'
            ),
            (
                'API Documentation (Swagger)',
                '2026-08-12 10:00:00',
                'Email'
            )

    ) AS v(
        task_name,
        reminder_date,
        reminder_type
    )

    INNER JOIN tasks t
        ON t.task_name = v.task_name

    WHERE NOT EXISTS (
        SELECT 1
        FROM task_reminders tr
        WHERE tr.task_id = t.id
        AND tr.reminder_type = v.reminder_type
        AND tr.reminder_date = v.reminder_date::timestamp
    );
`);

console.log("Task Reminders Seeded Safely");

console.log("Todo Database Seeded Successfully");

await pool.end();
process.exit(0);

} catch (error) {

    console.error("Seeder Error:", error);

    await pool.end();
    process.exit(1);
}

}

seed();