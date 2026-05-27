import { createSlice } from '@reduxjs/toolkit';


// friend request list: only pending list that need to be accepted from my side (isPending true from my side) and also the list of friends 
// that i have sent request to but they have not accepted yet. (isPending true) from there side

const initialState = {
    incomingFriendRequestList: [],
    outgoingFriendRequestList: []
}

const friendSlice = createSlice({
    name: 'friendList',
    initialState,
    reducers: {
        setPendingFriends: (state, action) => {
            const { incomingRequests, outgoingRequests } = action.payload;
            state.incomingFriendRequestList = incomingRequests || [];
            state.outgoingFriendRequestList = outgoingRequests || [];
        },
        addInitialOutgoingrequest: (state, action) => {
            const data = action.payload;
            state.outgoingFriendRequestList = data || [];
        },
        addInitialIncomingrequest: (state, action) => {
            const data = action.payload;
            state.incomingFriendRequestList = data || [];
        },
        addIncomingFriendRequest: (state, action) => {
            state.incomingFriendRequestList.push(action.payload);
        },
        acceptFriendRequest: (state, action) => {
            const requestId = action.payload;
            state.incomingFriendRequestList = state.incomingFriendRequestList.filter(request => request.id !== requestId);
        },
        rejectFriendrequest: (state, action) => {
            const requestId = action.payload;
            state.incomingFriendRequestList = state.incomingFriendRequestList.filter(request => request.id !== requestId);
        },
        addTempOutgoingFriendRequest: (state, action) => {
            state.outgoingFriendRequestList.push(action.payload);
        },
        addPermanentOutgoingFriendRequest: (state, action) => {
            const tempId = Object.keys(action.payload)[0];
            const existingOutgoingRequest = [...state.outgoingFriendRequestList];
            const requestIndex = existingOutgoingRequest.findIndex(request => request.id === tempId);
            const permObj = action.payload[tempId];
            if (requestIndex !== -1) {
                existingOutgoingRequest[requestIndex] = permObj;
                state.outgoingFriendRequestList = existingOutgoingRequest;
            }else{
                state.outgoingFriendRequestList.push(permObj);
            }
        },
        cancelSentFriendRequest: (state, action) => {
            const requestId = action.payload;
            state.outgoingFriendRequestList = state.outgoingFriendRequestList.filter(request => request.id !== requestId);
        }

    }
});

export const { setPendingFriends,addInitialOutgoingrequest,addInitialIncomingrequest, addIncomingFriendRequest, acceptFriendRequest, rejectFriendrequest, addTempOutgoingFriendRequest, addPermanentOutgoingFriendRequest, cancelSentFriendRequest } = friendSlice.actions;

export default friendSlice.reducer;