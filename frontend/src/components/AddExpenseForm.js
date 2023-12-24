import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Item } from '../helper';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useDataContext } from '../context';
import { useLocation } from "react-router-dom";


export default function AddExpenseForm({ budgets, handleCreateUpdateClick }) {
    const location = useLocation();
    const [budgetId, setBudgetId] = React.useState('default');
    const [name, setName] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const { sharedData, updateData } = useDataContext();

    useEffect(() => {
        if (sharedData && sharedData.type === 'expense') {
            setAmount(sharedData.data.amount);
            setName(sharedData.data.name);
            setBudgetId(sharedData.data.budgetId)
        }
    }, [sharedData,budgets]);
    const handleChange = (event) => {
        console.log(event)
        setBudgetId(event.target.value);
    };

    const expenseSubmit = async (event) => {
        event.preventDefault();
        let obj = {
            name,
            amount,
            budgetId
        };
        handleCreateUpdateClick(obj);
        setName('');
        setAmount('');
        setBudgetId('');
        updateData('')
    };
    const expenseCancel = () => {
        setName('');
        setAmount('');
        setBudgetId('')
        updateData('')
    }
    return (
        <Item>
            <p className='item-header'>{sharedData && sharedData.type === 'expense' ? 'Update Expense' : 'Add New Expense'}</p>
            <Grid item xs={12} className='home-space-text-field'>
                <TextField

                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    variant="standard"
                    size="small"
                    focused={true}
                    placeholder='e.g., Coffee'
                    onChange={(event) => { setName(event.target.value) }}
                    value={name}
                />

            </Grid>
            <Grid item xs={12}>
                <TextField
                    name="amount"
                    required
                    fullWidth
                    id="amount"
                    label="Amount"
                    placeholder='e.g., MMK 100000'
                    variant="standard"
                    size="small"
                    focused={true}
                    onChange={(event) => { setAmount(event.target.value) }}
                    value={amount}
                />
            </Grid>
            <Grid item xs={12}>
                {location.pathname !== '/home' || budgets.length === 0 ? ('') : (
                    <FormControl className='expense-select' required name="budget"
                        fullWidth variant="standard" focused sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel className='expense-select-label' id="demo-simple-select-standard-label">Budgets</InputLabel>

                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={budgetId}
                            onChange={handleChange}
                            label="Budget"
                            name="budget"

                        >
                            <MenuItem value="default"  disabled>
                                <span style={{color: "darkgray"}}>Please Choose ...</span>
                            </MenuItem>
                            {budgets.map((budget) => {
                                return <MenuItem key={budget._id} value={budget._id}>{budget.name}</MenuItem>
                            })
                            }

                        </Select>
                    </FormControl>
                )}

            </Grid>
            <Grid item xs={12}>
                <Button className='card-btn' onClick={expenseSubmit} type="submit" variant="contained" size="small" endIcon={<AddCircleOutlineIcon />}>
                    {sharedData && sharedData.type === 'expense' ? 'Update Expense' : 'Create Expense'}
                </Button>
                <Button className='card-btn budget-add-clear-btn' onClick={expenseCancel} type="submit" variant="contained" color="error" size="small" endIcon={<HighlightOffIcon />}>
                    Cancel
                </Button>
            </Grid>

        </Item>
    );
}