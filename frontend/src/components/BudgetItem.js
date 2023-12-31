import React, { useEffect, useState, } from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate, useLocation } from "react-router-dom";

import { useDataContext } from '../context';
import { ModalForm } from '../components/ModalForm';
import { ExpenseModalForm } from '../components/ExpenseModalForm';

import {
  formatCurrency,
  formatPercentage,
  calculateSpentByBudget,
  capitalize
} from "../helper";

import DeleteConfirmModal from './DeleteConfirmModal';

export default function BudgetItem({ budget, deleteBudgetClick, handleCreateUpdate, handleCreateUpdateExpenseClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { _id, name, amount, color, expenses } = budget;
  const [spent, setSpent] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const { updateData } = useDataContext();
  const [openModal, setOpenModal] = useState(false);
  const [openModalForm, setOpenModalForm] = React.useState(false);
  const [openExpenseModalForm, setOpenExpenseForm] = React.useState(false)

  // Close budget form modal to pass to data to parent to update
  const handleCloseModalForm = (value) => {
    setOpenModalForm(false);
    if (value) handleCreateUpdate(value);
  };

   // Call budget modal and creat context to pass data
   const editBudget = () => {
    setOpenModalForm(true)
    updateData({ type: 'budget', data: budget })
  }
  //  Call delete confirmation modal
  const deleteBudget = () => {
    setOpenModal(true)
  };

  // Open expense modal pass to data to parent
  const handleCloseExpenseModalForm = (value) => {
    setOpenExpenseForm(false);
    if (value) handleCreateUpdateExpenseClick(value);
  };

 
  useEffect(() => {
    if (_id) {
      setTotalExpenses(expenses.length);
      setSpent(calculateSpentByBudget(expenses, _id))
    }
  }, [_id, expenses]);

  const budgetDetail = () => {
    navigate(`budget/${_id}`);
  }

  // Close modal and delete budget
  const closeModal = (value) => {
    if (value === 'yes') {
      deleteBudgetClick(budget._id)
    }
    setOpenModal(false);
  };

  // Call expense modal to create
  const callExpenseModalForm = () => {
    setOpenExpenseForm(true)
  }

  return (
    <>
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
                location.pathname === '/home' ? (
                  <Tooltip title="Add Expense">
                    <IconButton aria-label="delete" size="small" color="primary" onClick={callExpenseModalForm}>
                      <AddCircleIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>) : ('')
              }

              <Tooltip title="Edit Budget">
                <IconButton aria-label="edit" onClick={editBudget} size="small" color='success'>
                  <EditIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete Budget">
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
        <DeleteConfirmModal openModal={openModal} closeModal={closeModal} />
        <ModalForm
          open={openModalForm}
          onClose={handleCloseModalForm}
        />
        <ExpenseModalForm
          open={openExpenseModalForm}
          budgetId={budget._id}
          onClose={handleCloseExpenseModalForm}
        />
      </Card>

    </>
  );
}