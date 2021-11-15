INSERT INTO departments (name)
VALUES
    ('Sales'),
    ('Customer Service');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Sales Manager', '100000', 1),
    ('CS Manager', '100000', 2),
    ('Sales Shift Leader', '75000', 1),
    ('CS Shift Leader', '75000', 2),
    ('Sales Associate', '50000', 1),
    ('CS Associate', '50000', 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Manager', 'One', 1, NULL),
    ('Manager', 'Two', 2, NULL),
    ('Shift Leader', 'One', 3, 1),
    ('Shift Leader', 'Two', 4, 2),
    ('Associate', 'One', 5, 1),
    ('Associate', 'Two', 6, 2);