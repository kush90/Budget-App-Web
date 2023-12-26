import React, { useEffect, useState, } from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate, useLocation } from "react-router-dom";

import { useDataContext } from '../context';

import {
  formatCurrency,
  formatPercentage,
  calculateSpentByBudget,
  capitalize
} from "../helper";

export default function BudgetItem({ budget,deleteBudgetClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { _id, name, amount, color, expenses } = budget;
  const [spent, setSpent] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const { updateData } = useDataContext();

  
  const editBudget = () => {
    updateData({ type: 'budget', data: budget })
    scrollToTop();
  }

  const deleteBudget =  () => {
    deleteBudgetClick(budget._id)
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: adds a smooth scrolling effect
    });
  };
  
  useEffect(() => {
    if (_id) {
      setTotalExpenses(expenses.length);
      setSpent(calculateSpentByBudget(expenses, _id))
    }
  });

  const budgetDetail = () => {
    navigate(`budget/${_id}`);
  }

  return (
    <Card className="budget" style={{
      "color": `hsl(${color})`, "border": "1px solid whitesmoke"
    }}>

      {
        (spent > amount &&
          <span className='over-budget'>*** Over Spent</span>
          )
      }
      <div className="progress-text">
        <h3 className='card-header-first'>{capitalize(name)} <small className='total-expense'>({totalExpenses} Expenses)</small>
          <span className='budget-action'>
            {
              location.pathname === '/home' ? (<Tooltip title="To edit the budget, see the above update budget form!">
                <IconButton aria-label="edit" onClick={editBudget} size="small" color='success'>
                  <EditIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>) : ('')
            }

            <Tooltip title="Delete">
              <IconButton aria-label="delete" size="small" color="error" onClick={deleteBudget}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </span>
        </h3>
        <p className='card-header-second'>{formatCurrency(amount)} Budgeted</p>
      </div>
      <progress className='progress' max={amount} value={spent}  >
        {formatPercentage(spent / amount)}
      </progress>
      <div className="progress-text" style={{ "marginBottom": location.pathname !== "/home" ? '20px' : '' }}>
        <small className="budget-spend">{formatCurrency(spent)} spent</small>
        <small className='budget-remaining'>{formatCurrency(amount - spent)} remaining</small>

      </div>
      <div>
        {location.pathname === '/home' ? (<Grid item xs={12} className='budget-btn' onClick={budgetDetail}>
          <Button style={{
            "backgroundColor": `hsl(${color})`, color: 'white'
          }} className='' variant="contained" size="small" endIcon={<MonetizationOnIcon />}>
            View Budget Detail
          </Button>
        </Grid>) : ('')}

      </div>
    </Card>
  );
}