import React from 'react';

const withDecoration = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    return (props: P) => (
        <>
            <WrappedComponent {...props} />
        </>
    );
};

export default withDecoration;