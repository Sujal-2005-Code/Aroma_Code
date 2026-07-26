import { api } from "@/lib/api/client";


export async function submitAssessment(data:any){

return api("/submissions",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
}
);

}
