export function Heading({
    children,
    tag = 'h1',
    variant, // Nueva prop para tipos MD3: 'display', 'headline', 'title'
    size, // 'large', 'medium', 'small'
    color = 'grey',
    weight = 'regular',
    align,
    className = ''
}) {
    const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const TagComponent = allowedTags.includes(tag) ? tag : 'h1';

    // Material Design 3 Typography Scale
    const typographyMD3 = {
        display: {
            large: 'text-[36px] leading-[44px] sm:text-[57px] sm:leading-[64px]',
            medium: 'text-[32px] leading-[40px] sm:text-[45px] sm:leading-[52px]',
            small: 'text-[28px] leading-[36px] sm:text-[36px] sm:leading-[44px]',
        },
        headline: {
            large: 'text-[28px] leading-[36px] sm:text-[32px] sm:leading-[40px]',
            medium: 'text-[24px] leading-[32px] sm:text-[28px] sm:leading-[36px]',
            small: 'text-[22px] leading-[28px] sm:text-2xl sm:leading-8',
        },
        title: {
            large: 'text-[20px] leading-[28px] sm:text-[22px] sm:leading-7',
            medium: 'text-base leading-6',
            small: 'text-sm leading-5',
        }
    };

    // Mapeo automático de tags a variantes MD3 (si no se especifica variant)
    const defaultVariants = {
        h1: { variant: 'headline', size: 'large' },
        h2: { variant: 'headline', size: 'medium' },
        h3: { variant: 'headline', size: 'small' },
        h4: { variant: 'title', size: 'large' },
        h5: { variant: 'title', size: 'medium' },
        h6: { variant: 'title', size: 'small' },
    };

    // Determinar variant y size
    const finalVariant = variant || defaultVariants[tag]?.variant || 'headline';
    const finalSize = size || defaultVariants[tag]?.size || 'medium';

    // Colores
    const textColor = {
        white: 'text-white',
        green: 'text-[#005840]',
        grey: 'text-[#383838]',
        black: 'text-black',
    };

    // Pesos de fuente MD3
    const textWeight = {
        regular: 'font-normal',    // 400
        medium: 'font-medium',     // 500
        semibold: 'font-semibold', // 600
        bold: 'font-bold',         // 700
    };

    // Alineación
    const textAlign = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    };

    return (
        <TagComponent 
            className={`
                ${typographyMD3[finalVariant][finalSize]}
                ${textColor[color]} 
                ${textWeight[weight]}
                ${align ? textAlign[align] : ''}
                ${className}
            `.trim().replace(/\s+/g, ' ')}
        >
            {children}
        </TagComponent>
    );
}