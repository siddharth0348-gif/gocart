import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productDummyData } from '@/assets/assets'
import api from '@/lib/api'

export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async (category, { rejectWithValue }) => {
        try {
            const data = await api.getProducts(category);
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: productDummyData,
        loading: false,
        error: null,
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload
        },
        clearProduct: (state) => {
            state.list = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.length > 0) {
                    state.list = action.payload;
                }
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // Graceful fallback to initial dummy data
            })
    }
})

export const { setProduct, clearProduct } = productSlice.actions
export default productSlice.reducer
