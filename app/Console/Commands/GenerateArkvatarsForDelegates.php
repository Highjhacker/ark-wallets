<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use ArkEcosystem\Client\Connection;


class GenerateArkvatarsForDelegates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'arkvatars:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "Generate Arkvatars for the 51 actives delegates and 51 standby delegates if they don't have one.";

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $connection = new Connection([
            'host' => 'http://178.62.247.235:4003/api/', // TRAILING SLASH!
        ]);

        $client = new \GuzzleHttp\Client();

        $response = $connection->delegates()->all(['limit' => 100]);
        $data = $response['data'];

        foreach ($data as $delegate) {
            $client->request('POST', 'https://arkvatar.com/api/store', [
                'form_params' => [
                    'identifier' => $delegate['address'],
                    'type' => 'Ark'
                ]
            ]);
            $this->line($delegate['address']);
            sleep(1);
        }
    }
}
