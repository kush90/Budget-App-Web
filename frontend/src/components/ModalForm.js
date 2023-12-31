import * as React from 'react';

import Dialog from '@mui/material/Dialog';

import AddBudgetForm from './AddBudgetForm';
import { useDataContext } from '../context';


export function ModalForm(props) {
  const { onClose, open } = props;
  const { updateData } = useDataContext();


  const handleClose = () => {
    onClose();
    updateData('')
  };
  const handleCreateUpdate = (value) =>{
    onClose(value)
  }

  return (
    <Dialog onClose={handleClose} open={open}>
        <AddBudgetForm handleCreateUpdate={handleCreateUpdate} handleCloseForm={handleClose}/>
    </Dialog>
  );
}