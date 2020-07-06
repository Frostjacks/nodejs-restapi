const express = require('express')
const router = express.Router()
const Subscriber = require('../models/subscriber')

// getting all subscribers
router.get('/', async (req, res) => {
    try{
        const subscribers = await Subscriber.find()
        res.json(subscribers)
    } catch(err){
        // the request will fail if server gives the error and this may result from bad query which is our fault but not of client so we dont send 404 but rather 500 which is for server error
        res.status(500).json({ message: err.message})
    }
})

router.get('/:id', getSubscriber, (req, res) => {
    res.json(res.subscriber)
})

router.post('/', async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscriberdToChannel: req.body.subscriberdToChannel
    })

    try{
        const newSubscriber = await subscriber.save()
        res.status(201).json(newSubscriber)
    } catch (err){
        // request will fail if user gives the bad data (and has nothing to do with server), so if the client makes error we send 400
        res.status(400).json({ message: err.message })
    }
})

router.patch('/:id', getSubscriber, async (req, res) => {
    // unlike with put(which reupdates the all field) with path we only update the requests that are passed in its body

    if(req.body.name != null){
        res.subscriber.name = req.body.name
    }

    if(req.body.subscriberdToChannel != null){
        res.subscriber.subscriberdToChannel = req.body.subscriberdToChannel
    }
    try{
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
    } catch (err){
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', getSubscriber, async (req, res) => {
    try{
        // you can also get rid of the getSubscriber middleware and use findByIdAndDelete monggose method
        await res.subscriber.remove()
        res.json({ message: 'subscriber deleted' })
    } catch (err){
        res.status(500).json({ message: err.message })
    }
})

// middleware function
async function getSubscriber(req, res, next){
    let subscriber;  // same as let subscriber = undefined
    try{
        subscriber = await Subscriber.findById(req.params.id)

        if(subscriber == null){
            // if subscriber is not found then send 404(which represents not found)
            return res.status(400).json({ message: 'cannot find subscriber'})
        }
    } catch (err){
        res.status(500).json({ message: err.message })
    }

    // creating a variable on response object. This now can be accessed by the routes handler above
    res.subscriber = subscriber
    next();  // tells to run the function(ie (req, res)) in the routes handler above
}

module.exports = router