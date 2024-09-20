import './Footer.css'
import packageJson from '../../../../package.json'
import { isProd } from '@/index'
import { Link } from 'react-router-dom'

const Footer = () => {
    const hash = process.env.CF_PAGES_COMMIT_SHA || 'Local'
    const devContent = (
        <span>
            <span>
                <a
                    target="_blank"
                    rel="noreferrer"
                    href={`${packageJson.repository}/commit/${hash}`}
                >
                    {hash.slice(0, 7)}
                </a>
            </span>
        </span>
    )

    const prodContent = (
        <span>
            <span>{`${hash === 'Local' ? `local - ${process.env.MODE}` : hash?.slice(0, 7)}`}</span>
        </span>
    )

    return (
        <div className="footer container">
            <span>V{packageJson.version} | </span>
            <span>Commit: {isProd || hash === 'Local' ? prodContent : devContent} </span>
            <span>
                <span>| Copyright ©2023 </span>
                <a href="https://www.jventures.co.th/">{packageJson.author}</a>
            </span>
        </div>
    )
}

export default Footer
