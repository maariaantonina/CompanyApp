const Product = require('../models/product.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Product.find());
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const product = await Product.findOne().skip(rand);
    if (!product) res.status(404).json({ message: 'Not found' });
    else res.json(product);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) res.status(404).json({ message: 'Not found' });
    else res.json(product);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.addNew = async (req, res) => {
  try {
    const { name, client } = req.body;
    const newProduct = new Product({ name: name, client: client });
    await newProduct.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.change = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(
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
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id, (err, doc) => {
      if (err) res.status(404).json({ message: 'Not found...' });
      else res.json(doc);
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
