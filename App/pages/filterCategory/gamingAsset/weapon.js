import React, { useState } from "react";
import StandardDropdown from "../../standardDropdown/dropdown";
import { Button } from "@mui/material";
import axios from "axios";
import { SupercoolAuthContext } from "../../../context/supercoolContext";

const WeaponFeatures = () => {
    const superCoolContext = React.useContext(SupercoolAuthContext);
    const { setPrompt } = superCoolContext;
    const [weaponType, setWeaponType] = useState(weaponType || 'weapon type');
    const [designStyle, setDesignStyle] = useState(designStyle || 'design style');



    let detailPrompt = `Rewrite the prompt and add some more lines from you, giving it greater emphasis with more details, to create an image of Weapon based on this information:- create a dangerous ${weaponType} and make sure it's design style will be ${designStyle} and Remember to infuse the weapon image with vitality and energy`

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


    const weaponTypeOptionsText = [
        {
            id: 1,
            text: 'Gun',
        },
        {
            id: 2,
            text: 'Rifle',
        },
        {
            id: 3,
            text: 'Bows',
        },
        {
            id: 4,
            text: 'Shot gun',
        },
        {
            id: 5,
            text: 'Rocket launcher',
        },
        {
            id: 6,
            text: 'sword',
        },
    ];

    const designStyleOptionsText = [
        {
            id: 1,
            text: 'Modern',
        },
        {
            id: 2,
            text: 'Futuristic',
        },
        {
            id: 3,
            text: 'Steampunk',
        },
        {
            id: 4,
            text: 'Ancient',
        },
        {
            id: 5,
            text: 'Robotic',
        },
        {
            id: 6,
            text: 'Fantasy',
        },
    ];


    return (
        <>
            <StandardDropdown
                dropdownItemText={weaponTypeOptionsText}
                state={weaponType}
                setState={setWeaponType}
            />

            <StandardDropdown
                dropdownItemText={designStyleOptionsText}
                state={designStyle}
                setState={setDesignStyle}
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

export default WeaponFeatures;