import { Box, Typography, ButtonGroup, Button } from "@mui/material";

interface StyleButtonGroupProps {
    label: string;
    property: string;
    values: string[];
    currentValue: string;
    onStyleChange: (styleName: string, newValue: string) => void;
}

const buttonStyle = {
    fontSize: '0.8rem', 
    padding: '6px 12px',
};

const StyleButtonGroup: React.FC<StyleButtonGroupProps> = ({ label, property, values, currentValue, onStyleChange }) => {
    const buttonBackground = (value: string) => (currentValue === value ? 'primary.main' : 'transparent');

    return (
        <Box>
            <Typography variant="body2">{label}</Typography>
            <ButtonGroup variant="contained" aria-label={`${property} group`}>
                {values.map((value) => (
                    <Button
                        key={value}
                        onClick={() => onStyleChange(property, value)}
                        style={{ backgroundColor: buttonBackground(value), ...buttonStyle }}
                    >
                        {value.replace('-', ' ').toUpperCase()}
                    </Button>
                ))}
            </ButtonGroup>
        </Box>
    );
};

export default StyleButtonGroup