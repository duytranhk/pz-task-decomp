import React, { ReactElement, FC, useContext } from 'react';
import { AzureDevopsContext } from '../contexts/azure-devops.context';

const Header: FC<any> = (): ReactElement => {
    const { config } = useContext(AzureDevopsContext);
    return <div>Hello World: {config?.endpoint}</div>;
};

export default Header;
