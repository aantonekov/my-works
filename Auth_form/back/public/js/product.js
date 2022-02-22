const productForm = document.forms.productForm;


productForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const formData = new FormData (ev.target);
    const { data } = await axios.post('/product', formData);
    console.log('data', data);
   
})