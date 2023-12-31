import * as React from 'react';

import Dialog from '@mui/material/Dialog';

import AddExpenseForm from './AddExpenseForm';
import { useDataContext } from '../context';


export function ExpenseModalForm(props) {
  const { onClose, open } = props;
  const { updateData } = useDataContext();


  const handleClose = () => {
    onClose();
    updateData('')
  };
  const handleCreateUpdateClick = (value) =>{
    let obj = {...value};
    obj.budgetId = props.budgetId;
    onClose(obj)
  }

  return (
    <Dialog onClose={handleClose} open={open}>
        <AddExpenseForm handleCreateUpdateClick={handleCreateUpdateClick} handleCloseForm={handleClose}/>
    </Dialog>
  );
}