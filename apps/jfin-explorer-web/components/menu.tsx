import { JFINExplorerConfig } from '@config/jfin-explorer'

export function MenuDemo() {
    return (
        <div
            style={{
                backgroundColor: 'tomato',
                color: 'white',
                fontWeight: 600,
                padding: 10,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}
        >
            <div>JFIN Chain Explorer</div>
            <div
                style={{
                    backgroundColor: 'yellow',
                    color: 'black',
                    padding: '5px 10px',
                    borderRadius: 5,
                }}
            >
                <div>mode : {JFINExplorerConfig.get().mode}</div>
                <div>network : {JFINExplorerConfig.get().network}</div>
            </div>
        </div>
    )
}
