import axios from "axios"

const PayButton = () => {
    const handleCheckout = () =>{
        axios.post('http://localhost:3001/api/stripe/create-checkout-session').then((res)=>{
            if(res.data.url){
                window.location.href = res.data.url;     
            }
        })

    }
    return (
        <button onClick ={()=>handleCheckout()}>Pay for PRO</button>
    )

}
export default PayButton;