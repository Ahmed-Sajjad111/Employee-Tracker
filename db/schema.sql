/* department table
id: INTEGER PRIMARY KEY
name: varchar(30) to hold department name
*/

/* role table
id: INTEGER PRIMARY KEY
title: VARCHAR(30) to hold role title
salary: DECIMAL to hold role salary
deparment_id INTEGER to hold reference to department role belongs to
*/

/* employee table
id: INT PRIMARY KEY
first_name: VARCHAR(30) to hold employee first name
last_name: VARCHAR(30) to hold employee last name
role_id: INT to hold reference to employee role
manager_id: INT to hold reference to another employee that is manager of the current employee. 
This field might be null if the employee has no manager.
*/