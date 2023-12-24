import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useDataContext } from '../context';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';


import { Item } from '../helper';

export default function AddBudgetForm({ handleCreateUpdate }) {

    const [name, setName] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [color, setColor] = React.useState('');
   
    const { sharedData, updateData } = useDataContext();


    useEffect(() => {
        if (sharedData && sharedData.type === 'budget') {
            setAmount(sharedData.data.amount);
            setName(sharedData.data.name)
            setColor(sharedData.data.color)
        }
    }, [sharedData]);

    const budgetSubmit = async (event) => {
        event.preventDefault();
        handleCreateUpdate({name,amount,color,"id":sharedData.data ? sharedData.data._id : null})
        setName('');
        setAmount('');
        setColor('');
        updateData('');
    };

    

    const budgetCancel = () => {
        setName('');
        setAmount('');
        setColor('');
        updateData('')
    }

    return (
        <>
            <Item className=''>
                <p className='item-header'>{sharedData && sharedData.type === 'budget' ? 'Update Budget' : 'Create Budget'}</p>
                <Grid item xs={12} className='home-space-text-field'>
                    <TextField

                        name="name"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        autoFocus
                        variant="standard"
                        size="small"
                        placeholder='e.g., Groceries'
                        focused={true}
                        value={name}
                        onChange={(event) => { setName(event.target.value) }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="amount"
                        required
                        fullWidth
                        id="amount"
                        label="Amount"
                        placeholder='e.g., MMK 50000'
                        variant="standard"
                        size="small"
                        focused={true}
                        value={amount}
                        onChange={(event) => { setAmount(event.target.value) }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button className='card-btn' onClick={budgetSubmit} type="submit" variant="contained" size="small" endIcon={<MonetizationOnIcon />}>
                        {sharedData && sharedData.type === 'budget' ? 'Update Budget' : 'Create Budget'}
                    </Button>
                    <Button className='card-btn budget-add-clear-btn' onClick={budgetCancel} type="submit" variant="contained" color="error" size="small" endIcon={<HighlightOffIcon />}>
                        Cancel
                    </Button>
                </Grid>

            </Item>
          

        </>
    )

}