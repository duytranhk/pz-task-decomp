import React, { ReactElement, FC, useContext } from 'react';
import { AzureDevopsContext } from '../contexts/azure-devops.context';
const Header: FC<any> = (): ReactElement => {
    const { projects } = useContext(AzureDevopsContext);
    return (
        <div>
            {projects.map((p: any) => (
                <div key={p.id}>
                    <p>Name: {p.name}</p>
                    <pre>API: {p.url}</pre>
                </div>
            ))}
        </div>
    );
};

export default Header;
