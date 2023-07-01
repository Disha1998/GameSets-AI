import React, { useState } from "react";
import StandardDropdown from "../../standardDropdown/dropdown";
import { Button } from "@mui/material";
import axios from "axios";
import JacketCostume from "./jacket";
import PantCostume from "./pant";
import SkritCostume from "./skrit";
import CoatCostume from "./coat";
import ShirtCostume from "./shirt";
import JumpsuitCostume from "./jumpsuit";

const CreateCostume = () => {

    const [costumeType, setCostumeType] = useState('costume type');


    // let detailPrompt = `Rewrite the prompt and add some more lines from you, giving it greater emphasis with more details, to create a profile avatar based on this information:- make sure image style will be ${imageStyle}, gender:${gender}, hair style:${hairstyle},hair color:${hairColor}${gender == "Male" ? `,facial hair:${facialHair}` : ""},facial Expression:${facialExpression},eye color:${eyeColor},skin tone:${skinTone},clothing style:${clothingStyle},accessories:${accessories},body type:${bodyType},age:${age},ethnicity:${ethnicity}, Remember to infuse the avatar with vitality and energy`
    // console.log(detailPrompt);
    //   
    const generateText = async () => {

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/engines/text-davinci-003/completions',
                {
                    prompt: detailPrompt,
                    max_tokens: 700,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(response.data.choices[0].text);
            //   setText(response.data.choices[0].text);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const costumeTypeOptionsText = [
        {
            id: 1,
            text: 'Jacket',
        },
        {
            id: 2,
            text: 'Pant',
        },
        {
            id: 3,
            text: 'Jumpsuit',
        },
        {
            id: 4,
            text: 'Shirt',
        },
        {
            id: 5,
            text: 'Coat',
        },
        {
            id: 6,
            text: 'Skirt',
        },
    ];



    return (
        <>

            <StandardDropdown
                dropdownItemText={costumeTypeOptionsText}
                state={costumeType}
                setState={setCostumeType}
                // className="categories-scroll"
            />

            {costumeType == "Jacket" ? <JacketCostume /> : ""}
            {costumeType == "Pant" ? <PantCostume /> : ""}
            {costumeType == "Skirt" ? <SkritCostume /> : ""}
            {costumeType == "Coat" ? <CoatCostume /> : ""}
            {costumeType == "Shirt" ? <ShirtCostume /> : ""}
            {costumeType == "Jumpsuit" ? <JumpsuitCostume /> : ""}
            
        </>
    )
}

export default CreateCostume;