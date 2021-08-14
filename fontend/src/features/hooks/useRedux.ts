import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import { RootState, appDispatch } from "features/store";

export const useAppDispatch = () => useDispatch<appDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
