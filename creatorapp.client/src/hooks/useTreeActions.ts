import { JsonElement } from '../types'; 
import { treeActions } from '../utils/treeActions';

const useTreeActions = (
    configuration: JsonElement[],
    updateConfiguration: (updatedTree: JsonElement[]) => void,
    setSelectedElement: React.Dispatch<React.SetStateAction<JsonElement | null>>
) => {
    return treeActions(configuration, updateConfiguration, setSelectedElement);
};

export default useTreeActions;