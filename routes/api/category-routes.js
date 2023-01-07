const router = require('express').Router();
const { Category, Product } = require('../../models');
const { update } = require('../../models/Product');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
    const categoryData = await Category.findAll({
      include:[{model: Product}]
    }).catch((err)=>{
      res.json(err);
    });
    res.json(categoryData);
  // be sure to include its associated Products
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  try{
  const categoryData = await Category.findByPk(req.params.id, {
    include: [{model: Product}]
  });

  if(!categoryData){
    res.status(400).json({message: "No category found with this id."})
  }
  res.status(200).json(categoryData);
}catch(err){
  res.status(500).json(err); 
}
  // be sure to include its associated Products
});


router.post('/', async (req, res) => {
  // create a new category
  try{
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  }catch(err){
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{  
    const categoryData = await Category.update(req.body,
    {
      where: {id: req.params.id}
    }
  );
    if(!categoryData[0]){
      res.status(404).json({message: `No category with id: ${req.params.id} found.`})
    }
    res.status(200).json(categoryData);
  }catch(err){
    res.status(500).json(err);
  }

});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{
    //Using the findOne method first to access category name to use in response (not neccissary but wanted to try it out)
    const categoryName = await Category.findOne(
      {
        where: {id: req.params.id}
      });
    //Destroy method to delete the category with given id in request body params.
    const categoryData = await Category.destroy({
      where:{
        id: req.params.id
      }
    });
    if(!categoryData){
      res.status(404).json({message: `id: ${req.params.id} given does not match any category.`});
      return;
    }
    res.status(200).json(`${categoryName.category_name} category deleted successfully.`);
  }catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
