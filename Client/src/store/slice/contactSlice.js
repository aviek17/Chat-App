import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    contacts: [],
}

const contactSlice = createSlice({
    name : "contacts",
    initialState,
    reducers : {
        setContacts: (state, action) => {
            state.contacts = action.payload || [];
        },
        addContact: (state, action) => {
            state.contacts.push(action.payload);
        }
    }
})

export const { setContacts, addContact } = contactSlice.actions;

export default contactSlice.reducer;