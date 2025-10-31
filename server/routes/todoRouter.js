import {pool} from '../helper/db.js'
import {Router} from 'express'

const router = Router()

router.get('/', (req,res)=>{
    pool.query('SELECT * FROM task', (err,result) => {
        if(err){
            return next (err)
        }
    res.status(200).json(result.rows || [])
    })
})

router.post('/create', (req,res)=>{
    const {task} = req.body
    
    if(!task){
        return res.status(400).json({error:'Task is required'})
    }

    pool.query('Insert into task (description) values ($1) returning *', [task.description],
    (err,result)=>{
        if(err){
            return next(err)
        }
        res.status(201).json(result.rows[0])
    })
})

router.delete('/delete/:id', (req,res)=>{
    const {id} = req.params
    console.log(`Deleting task with id: ${id}`)
    pool.query('delete from task WHERE id = $1',
        [id], (err,result)=>{
            if(err){
                return next(err)
            }
            if(result.rowCount===0){
                const error = new Error('Task not found')
                error.status = 404
                return next(error)
            }
            return res.status(200).json({id})
        })
})

export default router