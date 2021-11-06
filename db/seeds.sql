INSERT INTO departments (name)
VALUES
    ('Sales'),
    ('Customer Service');

INSERT INTO roles (title, salary, deparment_id)
VALUES
    ('Manager', '100000.00', 1),
    ('Shift Leader', '75000.00', 2),
    ('Associate', '50000.00', 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Manager', 'One', 1, NULL),
    ('Manager', 'Two', 1, NULL),
    ('Manager', 'Three',1, NULL),
    ('Shift Leader', 'One',2, 1),
    ('Shift Leader', 'Two',2, 1),
    ('Associate', 'One',3, 1),
    ('Associate', 'Two',3, 2),
    ('Associate', 'Three'3, 3);