const Joi = require('joi');

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.object({
            url:Joi.string().allow("",null)
        }),
        price:Joi.number().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required()
    }).required()
})


module.exports.reviewSchema=Joi.object({
    rating:Joi.number().min(1).max(5).required(),
    comment:Joi.string().min(2).max(300).required()
});