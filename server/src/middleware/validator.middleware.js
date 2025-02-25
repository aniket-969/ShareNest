
export const validate = (schema) => async (req, res, next) => {
    console.log('Validate:', req.body); 
    
    try {
      await schema.parseAsync(req.body);
      next();  
    } catch (error) {
      console.error('Validation Error:', error);  
      res.status(400).json({
        message: "Validation failed",
        errors: error.errors  
      });
    }
  };
  