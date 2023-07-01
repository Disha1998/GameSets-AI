import React, { useState } from "react";
import StandardDropdown from "../../standardDropdown/dropdown";
import { Button } from "@mui/material";
import axios from "axios";
import { SupercoolAuthContext } from "../../../context/supercoolContext";

const PantCostume = () => {
    const superCoolContext = React.useContext(SupercoolAuthContext);
    const { setPrompt } = superCoolContext;
    const [designStyle, setDesignStyle] = useState(designStyle || 'design style');
    const [pantType, setPantType] = useState(pantType || 'pant type');
    const [pantLength, setPantLength] = useState(pantLength || 'pant length');
    const [pocketStyle, setPocketStyle] = useState(pocketStyle || 'pocket style');


    let detailPrompt = `Rewrite the prompt and add some more lines from you, giving it greater emphasis with more details, to create costume Pant based on this information:- make sure image style will be ${designStyle}, pant type:${pantType}, pant length shuold be:${pantLength}, pant's pockets should be ${pocketStyle} and Remember to infuse the avatar with vitality and energy`

    const generateText = async () => {
        console.log(detailPrompt);

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
            setPrompt(response.data.choices[0].text);
            //   setText(response.data.choices[0].text);
        } catch (error) {
            console.error('Error:', error);
        }
    };



    const designStyleOptionsText = [
        {
            id: 1,
            text: 'Modern',
        },
        {
            id: 2,
            text: 'Futuristic',
        },
    ];

    const pantTypeOptionsText = [
        {
            id: 1,
            text: 'Cargo pant',
        },
        {
            id: 2,
            text: 'Joggers',
        },
        {
            id: 3,
            text: 'Jeans',
        },
        {
            id: 4,
            text: 'Bootcut',
        },
        {
            id: 5,
            text: 'Leggings',
        },
    ];

    const pantLengthOptionsText = [
        {
            id: 1,
            text: 'Full length',
        },
        {
            id: 2,
            text: 'Cropped',
        },
        {
            id: 3,
            text: 'Ankle-length',
        },
        {
            id: 4,
            text: 'Capri-length',
        },
    ];

    const pocketStyleOptionsText = [
        {
            id: 1,
            text: 'Front pockets',
        },
        {
            id: 2,
            text: 'Back pockets',
        },
        {
            id: 3,
            text: 'Side pockets',
        },
        {
            id: 4,
            text: 'Cargo pockets',
        },
    ];



    return (
        <>

            <StandardDropdown
                dropdownItemText={designStyleOptionsText}
                state={designStyle}
                setState={setDesignStyle}
            />

            <StandardDropdown
                dropdownItemText={pantTypeOptionsText}
                state={pantType}
                setState={setPantType}
            />

            <StandardDropdown
                dropdownItemText={pantLengthOptionsText}
                state={pantLength}
                setState={setPantLength}
            />

            <StandardDropdown
                dropdownItemText={pocketStyleOptionsText}
                state={pocketStyle}
                setState={setPocketStyle}
            />

            <div style={{
                // textAlign: "center" 
                // , width: "100%" 
            }}>
                <Button color="secondary" className="animate-gradient mb-5" onClick={generateText} variant="outlined" style={{
                    //  width: "100%", 
                    fontSize: "20px"
                }} >Submit</Button>
            </div>
           
        </>
    )
}

export default PantCostume;