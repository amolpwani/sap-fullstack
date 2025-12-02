using { training as model } from '../db/schema';

service CatalogService @(path: '/catalog') {
  entity Employees as projection on model.Employee;
}
