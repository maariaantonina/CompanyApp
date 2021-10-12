const Employee = require('../models/employee.model');
const Department = require('../models/department.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Employee.find().populate('department'));
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const employee = await Employee.findOne().populate('department').skip(rand);
    if (!employee) res.status(404).json({ message: 'Not found' });
    else res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      'department'
    );
    if (!employee) {
      res.status(500).json({ message: 'Not found' });
    } else res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.postNew = async (req, res) => {
  try {
    const { firstName, lastName, department } = req.body;
    const dep = await Department.findById(department);
    if (dep) {
      const newEmployee = new Employee({
        firstName: firstName,
        lastName: lastName,
        department: department,
      });
      await newEmployee.save();
      res.status(404).json({ message: 'OK' });
    } else {
      res.json({ message: 'Wrong department id' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.edit = async (req, res) => {
  try {
    const dep = await Department.findById(req.body.department);
    if (!req.body.department || dep) {
      await Employee.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true },
        (err, doc) => {
          if (err) res.status(404).json({ message: 'Not found...' });
          else res.json(doc);
        }
      );
    } else {
      res.status(404).json({ message: 'Wrong department id' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  try {
    await Employee.findByIdAndRemove(req.params.id, (err, doc) => {
      if (err) res.status(404).json({ message: 'Not found...' });
      else res.json(doc);
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
