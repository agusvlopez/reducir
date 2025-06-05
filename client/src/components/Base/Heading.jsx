export function Heading({ children, tag, size, color, weight, align }) {

    const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const TagComponent = allowedTags.includes(tag) ? tag : 'h1';

    const fontSize = {

        h1: 'text-[30px]',
        h2: 'text-[28px]',
        h3: 'text-[26px]',
        h4: 'text-[24px]',
        h5: 'text-[22px]',
        h6: 'text-[20px]',

        mobile: {
            h1: 'text-[24px]',
            h2: 'text-[22px]',
            h3: 'text-[20px]',
            h4: 'text-[18px]',
            h5: 'text-[18px]',
            h6: 'text-[18px]',
        }
    }

    const textColor = {
        white: 'text-white',
        darkGreen: 'text-[#005840]',
        grey: 'text-[#383838]'
    }

    const textWeight = {
        semibold: 'font-semibold',
        bold: 'font-bold'
    }

    const textAlign = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    }

    return (
        <TagComponent className={`
        ${size ? fontSize[size] : fontSize[tag]} 
        ${textColor[color]} 
        ${textWeight[weight]}
        ${align && textAlign[align]}
        `}>
            {children}
        </TagComponent>
    );
}
