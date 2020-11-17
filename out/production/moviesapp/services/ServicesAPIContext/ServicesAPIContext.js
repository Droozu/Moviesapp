import React from 'react';

const {
	Provider: GenresProvider,
	Consumer: GenresConsumer
} = React.createContext();

const {
	Provider: ServiceApiProvider,
	Consumer: ServiceApiConsumer
} = React.createContext();

export {
	GenresProvider,
	GenresConsumer,
	ServiceApiProvider,
	ServiceApiConsumer,
};
