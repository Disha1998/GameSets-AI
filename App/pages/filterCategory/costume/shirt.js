import React, { useState } from "react";
import StandardDropdown from "../../standardDropdown/dropdown";
import { Button } from "@mui/material";
import axios from "axios";
import { SupercoolAuthContext } from "../../../context/supercoolContext";

const ShirtCostume = () => {
    const superCoolContext = React.useContext(SupercoolAuthContext);
    const { setPrompt } = superCoolContext;
    const [designStyle, setDesignStyle] = useState(designStyle || 'design style');
    const [shirtType, setShirtType] = useState(shirtType || 'shirt type');
    const [sleeveLength, setSleeveLength] = useState(sleeveLength || 'sleeve length');
    const [shirtColor, setShirtColor] = useState(shirtColor || 'color');
    const [shirtPattern, setShirtPattern] = useState(shirtPattern || 'pattern');



    let detailPrompt = `Rewrite the prompt and add some more lines from you, giving it greater emphasis with more details, to create costume Shirt based on this information:- make sure image style will be ${designStyle}, shirt type:${shirtType}, shirt color:${shirtColor},shirt's sleeves should be:${sleeveLength} and there should be ${shirtPattern} pattern on shirt and Remember to infuse the avatar with vitality and energy`
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

    const shirtTypeOptionsText = [
        {
            id: 1,
            text: 'T-shirt',
        },
        {
            id: 2,
            text: 'Button-up',
        },
        {
            id: 3,
            text: 'Polo shirt',
        },
        {
            id: 4,
            text: 'Henley shirt',
        },
    ];

    const sleeveLengthOptionsText = [
        {
            id: 1,
            text: 'short sleeves',
        },
        {
            id: 2,
            text: 'long sleeves',
        },
    ];
    const shirtColorOptionsText = [
        {
            id: 1,
            text: 'Red',
        },
        {
            id: 2,
            text: 'Blue',
        },
        {
            id: 3,
            text: 'Black',
        },
        {
            id: 4,
            text: 'Grey',
        },
        {
            id: 5,
            text: 'Pink',
        },
    ];
    const patternOptionsText = [
        {
            id: 1,
            text: 'Camouflage',
        },
        {
            id: 2,
            text: 'Animal',
        },
        {
            id: 3,
            text: 'flower',
        },
        {
            id: 4,
            text: 'funky',
        },
        {
            id: 5,
            text: 'Polka dots',
        },
    ];

    return (
        <>
            <div className="categories-scroll">
                <StandardDropdown
                    dropdownItemText={designStyleOptionsText}
                    state={designStyle}
                    setState={setDesignStyle}
                />

                <StandardDropdown
                    dropdownItemText={shirtTypeOptionsText}
                    state={shirtType}
                    setState={setShirtType}
                />

                <StandardDropdown
                    dropdownItemText={sleeveLengthOptionsText}
                    state={sleeveLength}
                    setState={setSleeveLength}
                />

                <StandardDropdown
                    dropdownItemText={shirtColorOptionsText}
                    state={shirtColor}
                    setState={setShirtColor}
                />

                <StandardDropdown
                    dropdownItemText={patternOptionsText}
                    state={shirtPattern}
                    setState={setShirtPattern}
                />

                <div style={{
                    // textAlign: "center" 
                    // , width: "100%" 
                }}>
                    <Button color="secondary" className="animate-gradient mb-5" onClick={generateText} variant="outlined" style={{
                        //  width: "100%", 
                        fontSize: "20px",
                    }} >Submit</Button>
                </div>

            </div>


        </>
    )
}

export default ShirtCostume;