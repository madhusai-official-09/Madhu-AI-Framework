export async function sendMessage(
    apiUrl:string,
    message:string
){

    const response = await fetch(

        `${apiUrl}/chat`,

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                message

            })

        }

    );

    if(!response.ok){

        throw new Error("Failed to contact MadhuAI server");

    }

    return response.json();

}